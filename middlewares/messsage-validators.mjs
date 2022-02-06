import mongoose from 'mongoose';
import CryptoJS from 'crypto-js';
const { isValidObjectId } = mongoose;

import { User, Message, Conversation } from '../models/index.mjs';


const findExistingMessageByOptions = async (option, { req }) => {
    try {
        const response = await messageOptions(option, req);
        return response;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

const messageOptions = async (option, req) => {
    const objectOptions = {
        owner : async () => {
            const { id, from = 0, limit = 20  } = req.query;

            if (!req.authenticatedUser) {
                throw new Error(`Se quieren obtener los mensajes sin enviar el token primero.`);
            }

            if (!id || !isValidObjectId(id)) {
                throw new Error(`Por favor, asegúrate de enviar el identificador del usuario del cual quieres obtener los mensajes y sea un id de mongo.`);
            }

            const dbUser = await User.findById(id);

            if (!dbUser) {
                throw new Error(`No se encontró el usuario con id ${id}`);
            }


            let dbMessages = await Message.find({ owner:id }).skip(+from).limit(limit);

            if( dbMessages.length > 0 ) {
                const dbConversation = await Conversation.findById(dbMessages[0].conversation);
                if (!dbConversation.participants.includes(req.authenticatedUser._id)){
                    throw new Error(`Este usuaro no hace parte de esta conversación por lo que no puede obtener los mensajes`);
                }
            }
    
            dbMessages = dbMessages.map(( single_message ) => {
                // Decrypt messages
                const bytes  = CryptoJS.AES.decrypt(single_message.message, process.env.SECRET_KEY_MESSAGES);
                single_message.message = bytes.toString(CryptoJS.enc.Utf8);
                return single_message;
            });

            req.messages = dbMessages;

            return true;

        },
        conversation: async () => {

        },
        default: () => {
            throw new Error(`La opción ${option} no se encuentra definida, asegúrate que estes utilizando las opciones permitidas, sí es así y el error persiste habla con el administrador para solucionar este problema.`);
        }
    }

    return (await objectOptions[option] || objectOptions['default'])();
}

export {
    findExistingMessageByOptions
}