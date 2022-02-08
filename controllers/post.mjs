import { Post } from '../models/index.mjs';

/**
 * Middleware para crear un nuevo post
 */
const newPost = async (req, res) => {
    try {
        const { message } = req.body;

        if (!req.authenticatedUser) {
            return res.status(401).json({
                ok: false,
                msg: 'Por favor, inicia sesión'
            });
        }

        const newPost = new Post({ owner: req.authenticatedUser._id, message:message.trim() });
        await newPost.save();

        return res.status(201).json({
            ok:true,
            msg:'El post ha sido añadido',
            post: newPost
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg:'Habla con el administrador pa solucionar este problema',
            error
        });
    }
}

export {
    newPost
}