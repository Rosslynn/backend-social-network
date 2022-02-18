import jwt from 'jsonwebtoken';
/**
 * Middleware para validar un token
 * @returns Error si el token no es valido, de lo contrario sigue el flujo
 */
const validateToken = (req, res, next) => {
    try {
        const token = req.header('x-token');

        if ( !token ) {
            return res.status(401).json({
                ok: false,
                msg:'No se encontró el token'
            })
        }

        const { uid } = jwt.verify(token, process.env.SECRET_KEY_JWT);
        req.uid = uid;
        next();

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            ok: false,
            msg: 'El token no es valido',
            error
        });
    }
}

export {
    validateToken
 }