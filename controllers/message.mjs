import CryptoJS from 'crypto-js';
import mongoose from 'mongoose';

import { Message } from "../models/index.mjs";


/*
* Middleware para crear un nuevo mensaje
*/
const newMessage = async (req, res) => {
    try {
        let { conversation, message } = req.body;
        message = message.trim()
        message = CryptoJS.AES.encrypt(message, process.env.SECRET_KEY_MESSAGES).toString();
        const newMessage = new Message({ owner:req.authenticatedUser.id, conversation, message });
        await newMessage.save();
        return res.status(201).json({
            ok:true,
            msg:'El mensaje ha sido creado con éxito'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg:'Contacta al administrador para solucionar este problema',
            error
        });
    }
}
/*
* Middleware para buscar mensajes por propiedad owner
*/
const findMessages = async (req, res) => {
    try {
        const { id } = req.params;
        const { from = 0, limit = 20 } = req.query;
        
        let dbMessages = await Message.find({ id }).skip(+from).limit(limit);
        const isValidOwner = dbMessages.every(({ owner }) => owner + '' === id);

        if (!isValidOwner) {
            return res.status(403).json({
                ok:false,
                msg:'Todos los mensajes no cumplen la condición de ser creados por la misma persona para poder obtenerlos.'
            });
        }

        dbMessages = dbMessages.map(( single_message ) => {
            // Decrypt messages
            const bytes  = CryptoJS.AES.decrypt(single_message.message, process.env.SECRET_KEY_MESSAGES);
            single_message.message = bytes.toString(CryptoJS.enc.Utf8);
            return single_message;
        });

        return res.status(200).json({
            ok:true,
            messages:dbMessages
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg:'Contacta al administrador para solucionar este problema',
            error
        });
    }
}

export {
    newMessage,
    findMessages
}