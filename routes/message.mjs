import { Router } from 'express';
import { body, param } from 'express-validator';

import { findMessages, newMessage } from '../controllers/message.mjs';
import { findExistingConversationSimple } from '../middlewares/db-validators.mjs';
import { findExistingMessageByOptions } from '../middlewares/messsage-validators.mjs';
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
    body('message', 'El mensaje es requerido').notEmpty(),
    validateFields
], newMessage);

// Obtener mensajes por propiedad owner
router.get('/:option', [
    param('option','El tipo de búsqueda a realizar es requerida, las opciones son: owner, conversation').exists().isIn(['owner','conversation']).custom(findExistingMessageByOptions),
    validateFields
], findMessages);



export default router;