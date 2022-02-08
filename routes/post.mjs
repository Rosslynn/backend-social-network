import { Router } from "express";
import { body, param} from "express-validator";

import { newPost, getPosts, deletePost } from "../controllers/post.mjs";
import { validateRights } from "../middlewares/post-validators.mjs";
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
], deletePost)


export default router;