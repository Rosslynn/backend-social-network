import { Router } from "express";
import { body } from "express-validator";

import { newPost } from "../controllers/post.mjs";
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

export default router;