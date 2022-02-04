import { Message } from "../models/index.mjs";

/*
* Middleware para crear un nuevo mensaje
*/
const newMessage = async (req, res) => {
    try {
        const {  conversation } = req.body;
        const message = new Message({ owner:req.authenticatedUser.id, conversation });
        await message.save();
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

export {
    newMessage
}