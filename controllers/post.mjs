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
/**
 * Middleware para obtener los posts
 */
const getPosts = async (req, res) => {
    try {
        const { from = 0, limit = 20 } = req.query;
        const [ totalOfPosts, posts ] = await Promise.all([
            Post.countDocuments(),
            Post.find().skip(+from).limit(+limit).populate({ path: 'likes', model:'User'}).populate({ path: 'owner', model:'User'})
        ]);
      
        return res.status(200).json({
            ok: true,
            total_posts:totalOfPosts,
            posts
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
    newPost,
    getPosts
}