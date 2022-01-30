import { Conversation } from "../models/index.mjs";

/**
 * Middleware para crear una nueva conversación
 * */
const newConversation = async (req, res) => {
    try {
        const { participants, ...rest } = req.body;
        const conversation = new Conversation({ participants });
        await conversation.save();

        return res.status(201).json({
            ok:true,
            msg:'Conversación creada',
            conversation
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
    newConversation
}