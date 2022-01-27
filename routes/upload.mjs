import { Router } from "express";
import { param } from "express-validator";

import { uploadFile } from "../controllers/upload.mjs";
import { findExistingPost, findExistingUser, hasRole } from "../middlewares/db-validators.mjs";
import { validateFields } from "../middlewares/validate-fields.mjs";
import verifyToken from "../middlewares/verify-token.mjs";

const router = Router();

// Subir archivo
router.post('/:id/:types/:postId', [
    verifyToken,
    hasRole('ADMIN','USER'),
    param('id','El id del usuario que subió el archivo es obligatorio y debe ser un id de mongo.').isMongoId().custom(findExistingUser),
    param('postId').optional().custom(findExistingPost),
    param('folder','Es necesario especificar este archivo a qué colección pertenece, si es de perfil de usuario (pictures) o de publicación (posts).').isIn('pictures','posts')
], uploadFile);


export default router;