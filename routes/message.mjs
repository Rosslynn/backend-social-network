import { Router } from 'express';
import { body, param } from 'express-validator';

import { newMessage } from '../controllers/message.mjs';
import { findExistingConversationSimple } from '../middlewares/db-validators.mjs';
import { validateFields } from '../middlewares/validate-fields.mjs';
import verifyToken from '../middlewares/verify-token.mjs';

const router = Router();

/*
* Se aplica el middleware de verificar token para todas las peticiones 
*/ 
router.use(verifyToken);

//Petición para crear un mensaje
router.post('/', [
    body('conversation','La conversación a la que pertenece este mensaje es obligatoria.').isMongoId().custom(findExistingConversationSimple),
    validateFields
], newMessage);

// Obtener mensajes por propiedad owner
router.get('/:owner',[
    param('owner', 'La propiedad owner es obligatoria'),
    validateFields
],)

// Obtener mensaejs por propiedad conversation


export default router;