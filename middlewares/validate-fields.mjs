import { validationResult } from "express-validator";


/**
 * Middleware para validar si existen errores en los campos requeridos en la petición
 * @returns - Error si algún campo específicado no cumple los requisitos de lo contrario continua el flujo
 */
const validateFields = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errors: errors.array()
        })
    }
    next();
}

export {
    validateFields
}