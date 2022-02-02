import mongoose from 'mongoose';
const { isValidObjectId } = mongoose;

import { User, Role, Conversation } from "../models/index.mjs";

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
        const dbUser = await User.findOne({ email }).populate({ path: 'followers', model:'User'});

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

/**
 * Función para validar los participantes al crear una conversación
 * @param {Array} participants - Array con el id de los participantes
 * @returns - Error si no se cumplen las condiciones, de lo contrario, true
 */
const validateParticipants = async (participants) => {
    try {
        if (!Array.isArray(participants) || participants.length < 2 || participants.length > 2) {
            throw new Error('La información enviada debe ser un array con ids de mongo de longitud 2 máximo.');
        }

        participants.map(value => {
            if (!isValidObjectId(value)) {
                throw new Error(`Todos los elementos deben ser un id de mongo. ${value} no cumple esta condición.`);
            }
            
            const numberWithSameId = participants.filter(id => id === value);
            const lengthWithSameId = numberWithSameId.length;

            if (lengthWithSameId > 1) {
                throw new Error(`No se pueden repetir ids. El id que se repite es: ${value}`);
            }
        });

        const dbConversation = await  Conversation.findOne({ participants });

        if (dbConversation) {
            throw new Error(`Ya existe una conversación con los ids ${participants} creada en la base de datos.`);
        }

        return true;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

/**
 * Función para verificar si existe una conversación
 * @param {String} option - Opción
 * @returns Error si no lo encuentra de lo contrario true
 */
 const findExistingConversation = async (option, { req }) => {
    try {
       const response = await validateConversation(option, req);
       return response;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}


const validateConversation = async (option, req) => {

    const conversationOptions = {
        singleID: async () => {
            const { id_one } = req.query;

            if (!id_one) {
                throw new Error(`Por favor, asegúrate de enviar el identificador de la conversación que quieras buscar`);
            }

            if (!isValidObjectId(id_one)) {
                throw new Error(`El identificador debe ser un id de mongo. ${id_one} no cumple esta condición.`);
            }

            const dbConversation = await Conversation.findById(id_one).populate({ path:'participants', model:'User' });

            if (!dbConversation) {
                throw new Error(`La conversación con el id ${id_one} no existe`);
            }

            req.conversation = dbConversation;
            return true;
        },
        twoIDs: async () => {
            const { id_one, id_two } = req.query;

            if (!id_one || !id_two) {
                throw new Error(`Por favor, asegúrate de enviar los identificadores (id_one, id_two) como query correspondiente a los dos usuario que deseas buscar que pertenezcan a una conversación. `);
            }
            
            if (!isValidObjectId(id_one) || !isValidObjectId(id_two)) {
                throw new Error(`Ambos identificadores enviados como query deben ser un id de mongo, asegúrate de que lo sean y reintentalo.`);
            }
            
            const dbConversation = await Conversation.findOne({ participants: { $all: [id_one, id_two] } }).populate({ path: 'participants', model: 'User' });

            if (!dbConversation) {
                throw new Error(`La conversación con los ids de usuario ${id_one} e id ${id_two} no existe.`);
            }

            req.conversation = dbConversation;
            return true;
        },
        atLeastOneID:  async () => {

        },
        default: () => {
            throw new Error(`La opción ${option} no se encuentra definida, asegúrate que estes utilizando las opciones permitidas, sí es así y el error persiste habla con el administrador para solucionar este problema.`);
        }
    }

    return await( conversationOptions[option] || conversationOptions['default'])()
}

export {
    validateEmailAndPassword,
    findUsedEmail,
    findExistingUser,
    hasRole,
    findExistingPost,
    findExistingRole,
    validateParticipants,
    findExistingConversation
}