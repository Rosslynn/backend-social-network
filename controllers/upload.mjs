import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { existsSync } from 'fs';

import { uploadTypeOption } from '../helpers/upload-file.mjs';

/**
 * Middleware para subir un archivo al servidor
 */
const uploadFile = async (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No se encontró el archivo a subir.');
        }

        const { id, folder, postId } = req.params;
        const { file } = req.files;

        const response = await uploadTypeOption(id, folder, file, postId, res);

        if (response === false) {
            return res.status(400).json({
                ok:false,
                msg:'Asegúrate que las extensiones sean válidas, las extensiones permitidas son .jpeg, .png, .jpg, si lo son y aún no funciona ponte en contacto con el administrador'
            });
        }
        
        return res.status(200).json({
            ok: true,
            msg: 'El archivo ha sido subido.'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Ocurrió un error, contacta al administrador para solucionar este problema',
            error
        });
    }
}


/**
 * Middleware para subir obtener un archivo del servidor
 */
 const getFile = async (req, res) => {
    try {
        const { fileName, folder } = req.params;
        const uploadPath = path.join(__dirname, `../${folder}`, fileName );

        if (!existsSync(uploadPath)) {
            return res.status(200).sendFile(path.join(__dirname, `../${folder}`, 'no-image.jpg'));
        }

        return res.status(200).sendFile(path.join(__dirname, `../${folder}`, fileName));

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Ocurrió un error, contacta al administrador para solucionar este problema',
            error
        });
    }
}


export {
    uploadFile,
    getFile
}
