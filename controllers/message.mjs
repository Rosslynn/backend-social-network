import { Message } from "../models/index.mjs";
import CryptoJS from 'crypto-js';

/*
* Middleware para crear un nuevo mensaje
*/
const newMessage = async (req, res) => {
    try {
        let { conversation, message } = req.body;
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
        const { owner} = req.params;
        const { from = 0, limit = 20 } = req.query;
        // Decrypt
        /*    var bytes  = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
        var originalText = bytes.toString(CryptoJS.enc.Utf8); */
        const dbMessages = await Message.find({ owner }).skip(+from).limit(limit);
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