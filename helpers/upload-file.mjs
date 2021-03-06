import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { existsSync, unlinkSync } from 'fs';
import * as cloudinary from 'cloudinary';

import { User, Post } from '../models/index.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
/**
 * @param {Object} file - Información del archivo a subir 
 * @param {String} validExtensions - Extensiones permitidas (expresión regular)
 * @param {String} folder - Carpeta donde se guardará el archivo 
 */
const uploadFileHelper = async (file, validExtensions = ['jpeg', 'jpg', 'png'] , folder = 'pictures') => {
    try {
      /*   const { name, mimetype } = file;
        const extFile = mimetype.split('/')[1];
        const fileName = `${uuidv4()}-${name}`;
        
        if (!validExtensions.test(extFile)) {
            return false;
        }

        const uploadPath = path.join(__dirname, `../${folder}`, fileName );
        await file.mv(uploadPath);
        return fileName; */

        const { url, public_id } = await cloudinary.v2.uploader.upload(file.tempFilePath,  { 
            folder,
            allowed_formats: validExtensions
        });

        return { url, public_id };

    } catch (error) {
        console.log(error);
        return false;
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
        "pictures": () => updateUserPicture(id, folder, file, res),
        "posts": () => updatePostPicture(postId, folder, file, res),
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
const updateUserPicture = async (id, folder, file, res) => {
    try {
        const dbUser = await User.findById(id);
        const { url, public_id } = await uploadFileHelper(file, undefined, folder);

        if (!url || !public_id) {
            return false;
        }

        if (dbUser.picture.url && dbUser.picture.public_id) {
            await cloudinary.v2.uploader.destroy(dbUser.picture.public_id);
            console.log(`Archivo ${dbUser.picture.public_id} borrado.`);
        }

        dbUser.picture.url = url;
        dbUser.picture.public_id = public_id;
        dbUser.updatedAt = new Date();
        dbUser.markModified('updatedAt');
        await dbUser.save();

    } catch (error) {
        console.log(error);
        return false;
    }
}

/**
 * Función para subir imagen destaca de publicación
 * @param {Object} id - Identificador de la publicación
 * @param {String} folder - Carpeta donde se almacenará el archivo
 * @param {String} file - Información del archivo subido
 */
const updatePostPicture = async (id, folder, file, res) => {
    try {
        const dbPost = await Post.findById(id);
        const { url, public_id }  = await uploadFileHelper(file, undefined, folder);

        if (!url || !public_id) {
            return false;
        }

        if (dbPost.picture.url && dbPost.picture.public_id) {
            await cloudinary.v2.uploader.destroy(dbPost.picture.public_id);
            console.log(`Archivo ${dbPost.picture.public_id} borrado.`);
        }

        dbPost.picture.url = url;
        dbPost.picture.public_id = public_id;
        dbPost.updatedAt = new Date();
        dbPost.markModified('updatedAt');
        await dbPost.save();
    } catch (error) {
        console.log(error);
        return false;
    }
}

export {
    uploadFileHelper,
    updateUserPicture,
    updatePostPicture,
    uploadTypeOption
}