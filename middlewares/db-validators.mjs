import { User, Role } from "../models/index.mjs";

/**
 * Función para validar si el correo dado como parámetro ya está registrado en la base de datos
 * @param {String} email - Correo electrónico a buscar 
 * @returns 
 */
const findUsedEmail = async (email) => {
    try {
        const dbUser = await User.findOne({ email });
        if (dbUser) throw new Error('Este correo electrónico ya está siendo utilizado.');
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
        });
    }
} 

/**
 * Función para buscar un usuario existente en la base de datos
 * @param {String} id - Identificador del usuario 
 * @returns Error si no lo encuentra de lo contrario true
 */
const findExistingUser = async (id) => {
    try {
        const dbUser = await User.findById(id);
        if (!dbUser) throw new Error(`No se encontró el usuario con id ${id}`);
        return true;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}
/**
 * Función para buscar un rol existente en la base de datos
 * @param {String} role - Rol a buscar en la base de datos 
 * @returns Error si no lo encuentra de lo contrario true
 */
const findExistingRole = async (role) => {
    try {
        const dbRole = await Role.findOne({ role });
        if (!dbRole) throw new Error(`No se encontró el rol con nombre ${role}`);
        return true;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

/**
 * TODO: Arreglar esto pero con POSTS
 * Función para buscar un usuario existente en la base de datos
 * @param {String} id - Identificador del usuario 
 * @returns Error si no lo encuentra de lo contrario true
 */
const findExistingPost = async (id) => {
    try {
        const dbUser = await User.findById(id);
        if (!dbUser) throw new Error(`No se encontró el usuario con id ${id}`);
        return true;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}


/**
 * Middleware para verificar que el usuario cumpla con los roles enviados como parámetro
 * @param  {...string} roles - Roles permitidos (en mayúsculas)
 * @returns - Error o continua el flujo
 */
const hasRole = (...roles) => {
    return (req, res, next) => {
        try {
            if (!req.authenticatedUser) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Se quiere validar el rol sin enviar el token primero.'
                });
            }

            if (!roles.includes(req.authenticatedUser.role)) {
                return res.status(403).json({
                    ok: false,
                    msg: `El rol de ${req.authenticatedUser.role} no te permite realiza esta acción, para hacerlo debes tener el rol(es) de ${roles}.`
                });
            }

            next();

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                ok: false,
                msg: 'Algo ha salido mal, contacta con el administrador para solucionar este problema.',
                error
            });
        }
    }
}


export {
    validateEmailAndPassword,
    findUsedEmail,
    findExistingUser,
    hasRole,
    findExistingPost,
    findExistingRole
}