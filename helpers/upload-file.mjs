import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { existsSync } from 'fs';

import { User } from '../models/index.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
/**
 * @param {Object} file - Información del archivo a subir 
 * @param {String} validExtensions - Extensiones permitidas (expresión regular)
 * @param {String} folder - Carpeta donde se guardará el archivo 
 */
const uploadFileHelper = async (file, validExtensions = /jpeg|jpg|png/, folder = 'pictures') => {
    try {
        const { name, mimetype } = file;
        const extFile = mimetype.split('/')[1];
        const fileName = `${uuidv4()}-${name}`;
        
        if (!validExtensions.test(extFile)) {
            return res.status(400).json({
                ok: false,
                msg: `El tipo de extensión ${extFile} no es permitido. Las extensiones permitidas son ${ validExtensions }`
            });
        }

        const uploadPath = path.join(__dirname, `../${folder}`, fileName );
        await file.mv(uploadPath);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg:'Ocurrió un error, contacta al administrador para solucionar este problema',
            error
        });
    }

}

/**
 * Función para subir imagen de perfil de usuario
 * @param {String} id - Identificador del usuario
 * @param {String} folder - Carpeta donde se almacenará el archivo
 * @param {String} file - Información del archivo subido
 */
const updateUserPicture = async (id, folder, file) => {
    try {
        const dbUser = await User.findById(id);

        if (dbUser.picture) {
            const uploadPath = path.join(__dirname, `../${folder}`, dbUser.picture );

            if (existsSync(uploadPath)) {
                fs.unlinkSync(uploadPath);
                console.log('Archivo borrado');
            }
        }
        //TODO: Probar que subir imagen de perfil de usuario funcione
        await uploadFileHelper(file, undefined, folder);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg:'Ocurrió un error, contacta al administrador para solucionar este problema',
            error
        });  
    }
}

/**
 * Función para subir imagen destaca de publicación
 * @param {Object} postId - Identificador de la publicación
 * @param {String} folder - Carpeta donde se almacenará el archivo
 */
const updatePostPicture = async (dbUser) => {
    try {
        console.log('sisarras');

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg:'Ocurrió un error, contacta al administrador para solucionar este problema',
            error
        });  
    }
}

export {
    uploadFileHelper,
    updateUserPicture,
    updatePostPicture
}