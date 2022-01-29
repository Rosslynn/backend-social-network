import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { existsSync, unlinkSync } from 'fs';

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
        return fileName;

    } catch (error) {
        console.log(error);
    }

}

/**
 * Función de devuelve un objeto literal con las opciones para subir un archivo
 * @param {String} id - Identificador del usuario que sube el archivo
 * @param {String} folder - Carpeta donde se guardará el archivo
 * @param {Object} file - Archivo
 * @param {String} postId - Identificador de la publicación (puede ser undefined) 
 * @param {Object} res - Para enviar una respuesta de error en caso de que no sea valida la carpeta
 */
 const uploadTypeOption = async (id, folder, file , postId, res) => {
    const uploadTypeDeleter = {
        "pictures": () => updateUserPicture(id, folder, file),
        "posts": () => updatePostPicture(postId, folder, file),
        "default": () => {
            return res.status(500).json({
                ok:false,
                msg:`No se puede guardar el archivo en la carpeta ${folder} habla con el administrador para solucionar este problema.`
            });
        },
    }
    
    return (await uploadTypeDeleter[folder] || uploadTypeDeleter['default'])();
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
                unlinkSync(uploadPath);
                console.log('Archivo borrado');
            }
        }

        const fileName = await uploadFileHelper(file, undefined, folder);
        dbUser.picture = fileName;
        await dbUser.save();

    } catch (error) {
        console.log(error);
    }
}

/**TODO: Hacer que esto funcione
 * Función para subir imagen destaca de publicación
 * @param {Object} postId - Identificador de la publicación
 * @param {String} folder - Carpeta donde se almacenará el archivo
 */
const updatePostPicture = async (dbUser) => {
    try {
        console.log('sisarras');
        //TODO: Hacer que se guarde la imagen de la publicación
    } catch (error) {
        console.log(error);
    }
}

export {
    uploadFileHelper,
    updateUserPicture,
    updatePostPicture,
    uploadTypeOption
}