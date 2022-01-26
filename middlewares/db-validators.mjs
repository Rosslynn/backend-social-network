import { User } from "../models/index.mjs";

/**
 * Función para validar si el correo dado como parámetro ya está registrado en la base de datos
 * @param {String} email - Correo electrónico a buscar 
 * @returns 
 */
const findUsedEmail = async (email) => {
    try {
        const dbUser = await User.findOne({ email });
        if (dbUser) throw new Error('Este correo electrónico se encuentra en uso.');
        return true;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
} 

/**
 * Middleware para validar que el correo y la contraseña dados se validen las credenciales y estado del usuario
 */
const validateEmailAndPassword = async (req, res , next ) => {
    try {
        const { email, password } = req.body; 
        const dbUser = await User.findOne({ email });

        if (!dbUser) {
            return res.status(400).json({
                ok:false,
                msg:'El correo o la contraseña no son validos.'
            });
        }

        if (!dbUser.status) {
            return res.status(400).json({
                ok:false,
                msg:`La cuenta de ${ dbUser.fullName } se encuentra inactiva, habla con el administrador para solucionar esto.`,
            }); 
        }

        const comparePassword = await dbUser.comparePasswords(password);

        if (!comparePassword) {
            return res.status(400).json({
                ok:false,
                msg:'El correo o la contraseña no son validos.'
            });
        }
        
        req.user = dbUser;

        next();

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg:'Algo ha salido mal, contacta con el administrador para solucionar este problema.',
            error
        })
    }
} 



export {
    validateEmailAndPassword,
    findUsedEmail
}