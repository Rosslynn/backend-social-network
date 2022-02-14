import { Router } from "express";
import { body, param} from "express-validator";

import { newPost, getPosts, deletePost, addOrRemoveLikeToPost, getSinglePost } from "../controllers/post.mjs";
import { findExistingPost, validateRights } from "../middlewares/post-validators.mjs";
import { validateFields } from "../middlewares/validate-fields.mjs";
import verifyToken from "../middlewares/verify-token.mjs";

const router = Router();

// Se valida el token en todas las peticiones 
router.use(verifyToken);

/**
 * Petición para crear un post
*/
router.post('/', [
    body('message', 'El creador de este post es requerido').notEmpty(),
    validateFields
], newPost);

/*
 * Petición para obtener todos los posts 
*/
router.get('/', getPosts);

/**
 * Petición para borrar un post
*/
router.delete('/:id', [
    param('id','El identificador del post a borrar es obligatorio').isMongoId().custom(validateRights),
    validateFields
], deletePost);

// Petición para añadir / quitar likes a un post
router.patch('/:id/likes',[
    verifyToken,
    param('id').isMongoId().custom(findExistingPost),
    validateFields
], addOrRemoveLikeToPost);


// Petición para obtener un post en específico
router.get('/:id',[
    verifyToken,
    param('id').isMongoId().custom(findExistingPost),
    validateFields
], getSinglePost);



export default router;