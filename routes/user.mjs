import { Router } from "express";
import { body } from "express-validator";
import { newUser, getUsers } from "../controllers/user.mjs";
import { validateFields } from "../middlewares/validate-fields.mjs";
import verifyToken from "../middlewares/verify-token.mjs";

const router = Router();

/**
 * Petición para crear un usuario
*/
router.post('/', [
    body('name.first','Los nombres son obligatorios').notEmpty(),
    body('name.last','Los apellidos son obligatorios').notEmpty(),
    body('email','El correo electrònico es obligatorio').isEmail(),
    body('password','La contraseña es obligatoria, el mìnimo de caracteres es 6.').isLength(6),
    body('repeat_password','Repetir contraseña debe ser igual a contraseña.').exists().custom((repeat_password, { req }) => repeat_password === req.body.password),
    validateFields
], newUser);

/**
 * Petición para obtener la lista de usuarios
*/
router.get('/', getUsers)

export default router;