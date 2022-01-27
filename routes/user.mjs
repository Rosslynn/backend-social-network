import { Router } from "express";
import { body, param } from "express-validator";
import { newUser, getUsers, userLogin, deleteUser, updateBasicInfo } from "../controllers/user.mjs";
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

//Actualizar información básica del usuario
router.patch('/:id', [
    verifyToken,
    param('id','El id del usuario a editar es obligatorio y debe ser un id de mongo.').isMongoId(),
    body('name.first','Los nombres son obligatorios').notEmpty(),
    body('name.last','Los apellidos son obligatorios').notEmpty(),
    validateFields
], updateBasicInfo)

//Borrar usuario (poner estado inactivo)
router.delete('/:id', [
    verifyToken,
    param('id','El id del usuario a borrar es obligatorio y debe ser un id de mongo.').isMongoId(),
    validateFields
], deleteUser);
export default router;