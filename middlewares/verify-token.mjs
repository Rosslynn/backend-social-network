import jwt from 'jsonwebtoken';

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
        //TODO: Por ahora esto, si veo necesario más pues lo agrego aquí eventualmente
        req.uid = uid;
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