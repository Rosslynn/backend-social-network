import { Router } from "express";
import { param } from "express-validator";

import { getFile, uploadFile } from "../controllers/upload.mjs";
import { findExistingPost, findExistingUser, hasRole } from "../middlewares/db-validators.mjs";
import { validateFields } from "../middlewares/validate-fields.mjs";
import verifyToken from "../middlewares/verify-token.mjs";

const router = Router();

// Se aplica el middleware de verificar token para todas las peticiones
router.use(verifyToken);

// Subir archivo
router.post('/:id/:folder/:postId?', [
    hasRole('ADMIN','USER'),
    param('folder','Es necesario especificar este archivo a qué colección pertenece, si es de perfil de usuario (pictures) o de publicación (posts).').notEmpty().isIn(['pictures','posts']),
    param('id','El id del usuario que subió el archivo es obligatorio y debe ser un id de mongo.').isMongoId().custom(findExistingUser),
    param('postId').optional().custom(findExistingPost),
    validateFields
], uploadFile);

// Obtener archivo
router.get('/:folder/:fileName', [
    param('folder','La carpeta en la que está almacenada el archivo a obtener es requerida, los valores posibles son pictures o posts.').notEmpty().isIn(['pictures','posts']),
    param('fileName','El nombre del archivo a obtener es requerido').notEmpty(),
    validateFields
], getFile);


export default router;