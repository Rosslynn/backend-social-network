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
        const [ totalOfPostsActive, totalOfPosts, posts ] = await Promise.all([
            Post.where({ status:true }).countDocuments(),
            Post.countDocuments(),
            Post.find({ status:true }).skip(+from).limit(+limit).populate({ path: 'likes', model:'User'}).populate({ path: 'owner', model:'User'})
        ]);
      
        return res.status(200).json({
            ok: true,
            total_posts:totalOfPosts,
            total_posts_active:totalOfPostsActive,
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

/**
 * Middleware para obtener los posts
 */
const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const dbPost = await Post.findById(id);
        dbPost.status = false;
        await dbPost.save();
        return res.status(200).json({
            ok:true,
            msg:'El post ha sido eliminado',
            post:dbPost
        })
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
 * Middleware para añadir/quitar like a un post
 */
const addOrRemoveLikeToPost = async (req, res) => {
    try {
        const { authenticatedUser } = req;

        if (!authenticatedUser) {
            return res.status(400).json({
                ok:false,
                msg:'Se quiere añadir un like sin enviar el token de acceso'
            });
        }

        const { id } = req.params;
        let dbPost = await Post.findById(id);
        const findExistingLikeIndex = dbPost.likes.findIndex(like => like._id + '' === authenticatedUser._id + '');

        if (findExistingLikeIndex === -1) {
            dbPost.likes.push(authenticatedUser._id);
        } else {
            dbPost.likes.splice(findExistingLikeIndex, 1);
        }

        dbPost.updatedAt = new Date();
        dbPost.markModified('updatedAt');
        await dbPost.save();
        dbPost = await Post.findById(id).populate({ path: 'likes', model:'User'}).populate({ path: 'owner', model:'User'});

        return res.status(200).json({
            ok:true,
            post:dbPost
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
 * Middleware para obtener un Post en específico
 */
const getSinglePost = async (req, res) => {
    try {
        const { id } = req.params;
        const dbPost = await Post.findById(id);

        return res.status(200).json({
            ok:true,
            post:dbPost
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
    getPosts,
    deletePost,
    addOrRemoveLikeToPost,
    getSinglePost
}