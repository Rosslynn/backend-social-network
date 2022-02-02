import { Router } from "express";
import { check, param, query } from "express-validator";

import { getConversations, getSingleConversation, newConversation } from "../controllers/conversation.mjs";
import { findExistingConversation, validateParticipants } from "../middlewares/db-validators.mjs";
import { validateFields } from "../middlewares/validate-fields.mjs";
import verifyToken from "../middlewares/verify-token.mjs";

const router = Router();

/*
* Se aplica el middleware de verificar token para todas las peticiones 
*/ 
router.use(verifyToken);

/**
* Petición para crear una conversación
*/
router.post('/', [
    check('participants', 'Participants es una propiedad es requerida.').exists().custom(validateParticipants),
    validateFields
], newConversation);

/* 
* Petición para obtener las conversaciones
*/
router.get('/', getConversations); 

/*
* Petición para obtener una conversación en específico según su opción
*/
router.get('/:option',[
    param('option','El tipo de búsqueda a realizar es requerida, las opciones son: uniqueID, twoIDs, atLeastOneID').exists().isIn(['singleID','twoIDs','atLeastOneID']).custom(findExistingConversation),
    validateFields
], getSingleConversation);

export default router;