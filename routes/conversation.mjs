import { Router } from "express";
import { check } from "express-validator";

import { newConversation } from "../controllers/conversation.mjs";
import { validateParticipants } from "../middlewares/db-validators.mjs";
import { validateFields } from "../middlewares/validate-fields.mjs";
import verifyToken from "../middlewares/verify-token.mjs";

const router = Router();

// Se aplica el middleware de verificar token para todas las peticiones
router.use(verifyToken);

router.post('/', [
    check('participants', 'Participants es una propiedad es requerida.').exists().custom(validateParticipants),
    validateFields
], newConversation);

export default router;