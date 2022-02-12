import { Post } from '../models/index.mjs';

const  validateRights = async (id, { req }) => {
    try {
        if (!req.authenticatedUser) {
            throw new Error(`Se quiere validar los derechos a borrar un Post sin enviar el usuario que realiza la acción`);
        }

        const dbPost = await Post.findById(id);

        if (!dbPost) {
            throw new Error(`No se encontró el post con id ${id}`);
        }

        if (!dbPost.status) {
            throw new Error(`El post con id ${id} se encuentra inactivo`);
        }

        if (dbPost.owner + '' !== req.authenticatedUser._id + '') {
            throw new Error(`Para borrar el post el usuario que realiza la acción debe ser el mismo creador del post`);
        }

        return true;
    } catch (error) {
       console.log(error);
       throw new Error(error); 
    }
}

const  findExistingPost = async (id, { req }) => {
    try {
        const dbPost = await Post.findById(id);

        if (!dbPost) {
            throw new Error(`No se encontró el post con id ${id}`);
        }

        if (!dbPost.status) {
            throw new Error(`El post con id ${id} se encuentra inactivo`);
        }

        return true;
    } catch (error) {
       console.log(error);
       throw new Error(error); 
    }
}

export {
    validateRights,
    findExistingPost
}