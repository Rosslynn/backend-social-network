import jwt from 'jsonwebtoken';
import { User } from '../models/index.mjs';

/*
* Middelware para verificar el token
*/
const verifyToken = async (req, res, next) => {
    try {
        const token = req.header('x-token');

        if ( !token ) {
            return res.status(401).json({
                ok: false,
                msg:'No se encontró el token en la petición'
            })
        }

        const { uid } = jwt.verify(token, process.env.SECRET_KEY_JWT);
        const authenticatedUser = await User.findById(uid);

        if (!authenticatedUser) {
            return res.status(404).json({
                ok:false,
                msg:`El usuario con id ${ uid } no ha sido encontrado`,
            });
        }

        if (!authenticatedUser.status) {
            return res.status(400).json({
                ok:false,
                msg:`El usuario con id ${ uid } se encuentra con estado inactivo, habla con el administrador para solucionar esto.`,
            }); 
        }
        
        req.authenticatedUser = authenticatedUser;
        next();


    } catch (error) {
        console.log(error);
        return res.status(401).json({
            ok: false,
            msg: 'El token no es valido',
            error
        })
    }
}

export default verifyToken;