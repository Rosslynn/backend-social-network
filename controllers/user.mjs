import mongoose from 'mongoose';

import generateJWT from "../helpers/generate-jwt.mjs";
import { User, Role } from "../models/index.mjs";

/**
 * Middleware para crear un nuevo usuario en la base de datos
 */
const newUser = async (req, res) => {
    try {
        const { name, email, password, ...rest} = req.body;
        const user = new User({ name, email, password });
        // Encriptar la contraseña
        await user.hashPassword(password);
        await user.save();

        const token = await generateJWT(user.id);
    
        return res.status(201).json({
            ok:true,
            token,
            user
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg:'Ocurrió un error, contacta al administrador para solucionar este problema',
            error
        })
    }
}
/**
 * Middleware para obtener un usuario específico
 */
const getSingleUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userToAddFollower = await User.findById(id).populate({ path: 'followers', model:'User'}).populate({ path: 'following', model:'User'});
    
        return res.status(201).json({
            ok:true,
            user:userToAddFollower
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg:'Ocurrió un error, contacta al administrador para solucionar este problema',
            error
        })
    }
}

/**
 * Middleware para crear obtener la lista de usuarios en la base de datos
 */
const getUsers = async (req,res ) => {
    try {
      const { from = 0, limit = 20 } = req.query;
      const [ totalOfUsersActive, totalOfUsers, users ] = await Promise.all([
          User.where({ status:true }).countDocuments(),
          User.countDocuments(),
          User.find({ status:true }).skip(+from).limit(+limit).populate({ path: 'followers', model:'User'}).populate({ path: 'following', model:'User'})
      ]);
    
      return res.status(200).json({
          ok: true,
          total_users_active:totalOfUsersActive,
          total_users:totalOfUsers,
          users
      });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg:'Ocurrió un error, contacta al administrador para solucionar este problema',
            error
        })
    }
}

/**
 * Middleware para iniciar sesión
 */
const userLogin = async (req,res ) => {
    try {

        const user = req.user;
        const token = await generateJWT(user.id);
        return res.status(200).json({
            ok:true,
            token,
            user
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg:'Ocurrió un error, contacta al administrador para solucionar este problema',
            error
        })
    }
}

/**
 * Middleware para borrar usuario (estado inactivo)
 */
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userToAddFollower = await User.findById(id).populate({ path: 'followers', model:'User' }).populate({ path: 'following', model:'User'});

        if (!userToAddFollower.status) {
            return res.status(400).json({
                ok:false,
                msg:`La cuenta de ${userToAddFollower.fullName} ya se encuentra inactiva.`
            });
        }

         //Date types using built-in methods, tell mongoose about the change with doc.markModified('pathToYourDate') before saving.
        const updatedDate = new Date();
        userToAddFollower.status = false;
        userToAddFollower.updatedAt = updatedDate;
        userToAddFollower.markModified('updatedAt');
        await userToAddFollower.save();

        return res.status(200).json({
            ok:true,
            msg:`La cuenta de ${userToAddFollower.fullName} a partir de este momento ${updatedDate.toLocaleString()} se encuentra inactiva.`
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg:'Ocurrió un error, contacta al administrador para solucionar este problema',
            error
        })
    }
}

/**
 * Middleware para actualizar el correo electrónico de un usuario
 */
 const updateBasicInfo = async (req, res) => {
    try {
        const { email, password, ...rest  } = req.body;
        const { id } = req.params;
        const userToAddFollower = await User.findById(id).populate({ path: 'followers', model:'User' }).populate({ path: 'following', model:'User'});
        const comparePassword = await userToAddFollower.comparePasswords(password);

        if (!comparePassword) {
            return res.status(400).json({
                ok:false,
                msg:'Contraseña incorrecta'
            });
        }

        userToAddFollower.email = email;
        userToAddFollower.updatedAt =  new Date();
        userToAddFollower.markModified('updatedAt');
        await userToAddFollower.save();

        const token = await generateJWT(userToAddFollower.id);
    
        return res.status(200).json({
            ok:true,
            token,
            user:userToAddFollower
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg:'Ocurrió un error, contacta al administrador para solucionar este problema',
            error
        })
    }
}

 /* Middleware para actualizar la contraseña del usuario*/
 const updatePassword = async (req, res) => {
    try {
        const { password, new_password, ...rest  } = req.body;
        const { id } = req.params;
        const userToAddFollower = await User.findById(id).populate({ path: 'followers', model:'User' }).populate({ path: 'following', model:'User'});
        const comparePassword = await userToAddFollower.comparePasswords(password);

        if (!comparePassword) {
            return res.status(400).json({
                ok:false,
                msg:'La contraseña que escribiste es incorrecta'
            });
        }

        await userToAddFollower.hashPassword(new_password);
        userToAddFollower.updatedAt =  new Date();
        userToAddFollower.markModified('updatedAt');
        await userToAddFollower.save();

        const token = await generateJWT(userToAddFollower.id);
    
        return res.status(200).json({
            ok:true,
            token,
            user:userToAddFollower
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg:'Ocurrió un error, contacta al administrador para solucionar este problema',
            error
        })
    }
}

 /* Middleware para actualizar el rol del usuario*/
 const updateRole = async (req, res) => {
    try {
        const { role, ...rest  } = req.body;
        const { id } = req.params;
        const userToAddFollower = await User.findById(id).populate({ path: 'followers', model:'User' }).populate({ path: 'following', model:'User'});
    
        userToAddFollower.role = role;
        userToAddFollower.updatedAt =  new Date();
        userToAddFollower.markModified('updatedAt');
        await userToAddFollower.save();

        const token = await generateJWT(userToAddFollower.id);
    
        return res.status(200).json({
            ok:true,
            token,
            user:userToAddFollower
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg:'Ocurrió un error, contacta al administrador para solucionar este problema',
            error
        })
    }
}

/**
 * Middleware para añadir follower
*/
const addFollower = async (req, res) => {
    try {
        const { authenticatedUser } = req;
        const { id } = req.params;

        if (!authenticatedUser) {
            return res.status(400).json({
                ok:false,
                msg:'Se quiere añadir un follower sin enviar el token'
            });
        }

        if ( authenticatedUser._id + '' === id ) {
            return res.status(400).json({
                ok:false,
                msg:'No te puedes seguir a ti mismo'
            });
        }

        const [userToAddFollower, currentUserLogged] = await Promise.all([ 
            User.findById(id).populate({ path: 'followers', model:'User' }).populate({ path: 'following', model:'User'}),
            User.findById(authenticatedUser._id).populate({ path: 'followers', model:'User' }).populate({ path: 'following', model:'User'})
        ]);
        const followersIds = userToAddFollower.followers.filter(follower => follower._id + '' === currentUserLogged._id + '');

        if (followersIds.length > 0) {
            return res.status(400).json({
                ok: false,
                msg: `${currentUserLogged.fullName} usuario ya sigue a ${ userToAddFollower.fullName}`
            });
        }

        // Se le agrega el follower al usuario
        userToAddFollower.followers.push(currentUserLogged._id);
        userToAddFollower.updatedAt =  new Date();
        userToAddFollower.markModified('updatedAt');
        await userToAddFollower.save();

        // Se añade a la lista de seguidos el usuario actual
        currentUserLogged.following.push(id);
        await currentUserLogged.save();

        const token = await generateJWT(currentUserLogged.id);
    
        return res.status(200).json({
            ok:true,
            token,
            user:currentUserLogged
        });
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
    newUser,
    getUsers,
    userLogin,
    deleteUser,
    updateBasicInfo,
    updatePassword,
    updateRole,
    getSingleUser,
    addFollower
}