import jwt from 'jsonwebtoken';

/**
 * Función para generar un JWT
 * @param {String} uid 
 */
const generateJWT = async (uid) => {
    try {
        return jwt.sign({ uid }, process.env.SECRET_KEY_JWT, { expiresIn: '24h' });
    } catch (error) {
        console.log('No se pudo generar el token', error);
    }
}

export default generateJWT