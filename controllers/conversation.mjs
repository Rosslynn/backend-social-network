import  Conversation from "../models/conversation.mjs";

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

/**
 * Middleware para crear obtener la lista de conversaciones en la base de datos
 */
 const getConversations = async (req,res ) => {
    try {
      const { from = 0, limit = 20 } = req.query;
      const [ totalOfConversations, conversations ] = await Promise.all([
        Conversation.countDocuments(),
        Conversation.find().skip(+from).limit(+limit).populate({ path: 'participants', model:'User'})
      ]);

      return res.status(200).json({
          ok: true,
          total_conversations:totalOfConversations,
          conversations
      });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg:'Ocurrió un error, contacta al administrador para solucionar este problema',
            error
        });
    }
}

/**
 * Middleware para crear obtener la lista de conversaciones en la base de datos
 */
 const getSingleConversation = async (req, res ) => {
    try {
        const { conversations } = req;
        return res.status(200).json({
            ok:true,
            conversations
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg:'Ocurrió un error, contacta al administrador para solucionar este problema',
            error
        });
    }
}

export {
    newConversation,
    getConversations,
    getSingleConversation
}