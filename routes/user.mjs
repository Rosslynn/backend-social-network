import { Router } from "express";
import { body, param } from "express-validator";
import { newUser, getUsers, userLogin, deleteUser } from "../controllers/user.mjs";
import { validateEmailAndPassword, findUsedEmail, findExistingUser } from "../middlewares/db-validators.mjs";
import { validateFields } from "../middlewares/validate-fields.mjs";
import verifyToken from "../middlewares/verify-token.mjs";

const router = Router();

/**
 * Petición para crear un usuario
*/
router.post('/', [
    body('name.first','Los nombres son obligatorios').notEmpty(),
    body('name.last','Los apellidos son obligatorios').notEmpty(),
    body('email','El correo electrònico es obligatorio').isEmail().custom(findUsedEmail),
    body('password','La contraseña es obligatoria, el mìnimo de caracteres es 6.').isLength(6),
    body('repeat_password','Repetir contraseña debe ser igual a contraseña.').exists().custom((repeat_password, { req }) => repeat_password === req.body.password),
    validateFields
], newUser);

/**
 * Petición para obtener la lista de usuarios
*/
router.get('/', getUsers)

/**
 * Petición para iniciar sesión
*/

router.post('/login', [ 
    body('email','El correo electrónico es obligatorio').isEmail(),
    body('password','La contraseña es obligatoria, mínimo de caracteres es 6').isLength(6),
    validateFields,
    validateEmailAndPassword
] , userLogin);


//TODO: Actualizar información del usuario

//TODO: Borrar usuario (poner estado inactivo)
router.delete('/:id', [
    param('id','El id del usuario a buscar es obligatorio y debe ser un id de mongo.').isMongoId().custom(findExistingUser),
    validateFields
], deleteUser);
export default router;