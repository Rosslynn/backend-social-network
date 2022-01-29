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

        await uploadTypeOption(id, folder, file, postId, res);
        
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

export {
    uploadFile
}