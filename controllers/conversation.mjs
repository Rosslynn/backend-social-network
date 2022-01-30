
/**
 * Middleware para crear una nueva conversación
 * */
const newConversation = async (req, res) => {
    try {
        return res.json("paso");
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