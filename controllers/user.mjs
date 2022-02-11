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
        const userForUpdateFollower = await User.findById(id).populate({ path: 'followers', model:'User'}).populate({ path: 'following', model:'User'});
    
        return res.status(201).json({
            ok:true,
            user:userForUpdateFollower
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
        const userForUpdateFollower = await User.findById(id).populate({ path: 'followers', model:'User' }).populate({ path: 'following', model:'User'});

        if (!userForUpdateFollower.status) {
            return res.status(400).json({
                ok:false,
                msg:`La cuenta de ${userForUpdateFollower.fullName} ya se encuentra inactiva.`
            });
        }

         //Date types using built-in methods, tell mongoose about the change with doc.markModified('pathToYourDate') before saving.
        const updatedDate = new Date();
        userForUpdateFollower.status = false;
        userForUpdateFollower.updatedAt = updatedDate;
        userForUpdateFollower.markModified('updatedAt');
        await userForUpdateFollower.save();

        return res.status(200).json({
            ok:true,
            msg:`La cuenta de ${userForUpdateFollower.fullName} a partir de este momento ${updatedDate.toLocaleString()} se encuentra inactiva.`
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
        const userForUpdateFollower = await User.findById(id).populate({ path: 'followers', model:'User' }).populate({ path: 'following', model:'User'});
        const comparePassword = await userForUpdateFollower.comparePasswords(password);

        if (!comparePassword) {
            return res.status(400).json({
                ok:false,
                msg:'Contraseña incorrecta'
            });
        }

        userForUpdateFollower.email = email;
        userForUpdateFollower.updatedAt =  new Date();
        userForUpdateFollower.markModified('updatedAt');
        await userForUpdateFollower.save();

        const token = await generateJWT(userForUpdateFollower.id);
    
        return res.status(200).json({
            ok:true,
            token,
            user:userForUpdateFollower
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
        const userForUpdateFollower = await User.findById(id).populate({ path: 'followers', model:'User' }).populate({ path: 'following', model:'User'});
        const comparePassword = await userForUpdateFollower.comparePasswords(password);

        if (!comparePassword) {
            return res.status(400).json({
                ok:false,
                msg:'La contraseña que escribiste es incorrecta'
            });
        }

        await userForUpdateFollower.hashPassword(new_password);
        userForUpdateFollower.updatedAt =  new Date();
        userForUpdateFollower.markModified('updatedAt');
        await userForUpdateFollower.save();

        const token = await generateJWT(userForUpdateFollower.id);
    
        return res.status(200).json({
            ok:true,
            token,
            user:userForUpdateFollower
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
        const userForUpdateFollower = await User.findById(id).populate({ path: 'followers', model:'User' }).populate({ path: 'following', model:'User'});
    
        userForUpdateFollower.role = role;
        userForUpdateFollower.updatedAt =  new Date();
        userForUpdateFollower.markModified('updatedAt');
        await userForUpdateFollower.save();

        const token = await generateJWT(userForUpdateFollower.id);
    
        return res.status(200).json({
            ok:true,
            token,
            user:userForUpdateFollower
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
 * Middleware para añadir o quitar un follower
*/
const addOrRemoveFollower = async (req, res) => {
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
                msg:'No te puedes seguir / dejar de seguir a ti mismo'
            });
        }

        const [userForUpdateFollower, currentUserLogged] = await Promise.all([ 
            User.findById(id).populate({ path: 'followers', model:'User' }).populate({ path: 'following', model:'User'}),
            User.findById(authenticatedUser._id).populate({ path: 'followers', model:'User' }).populate({ path: 'following', model:'User'})
        ]);
        const followersIds = userForUpdateFollower.followers.findIndex(follower => follower._id + '' === currentUserLogged._id + '');
     
        // Si no lo encuentra se agrega de lo contrario se borra
        if (followersIds === -1) {
             // Se le agrega el follower al usuario
             userForUpdateFollower.followers.push(currentUserLogged._id);
             userForUpdateFollower.updatedAt = new Date();
             userForUpdateFollower.markModified('updatedAt');
             await userForUpdateFollower.save();
 
             // Se añade a la lista de seguidos el usuario actual
             currentUserLogged.following.push(id);
             await currentUserLogged.save();
        } else {
            // Se elimina el seguidor del que recibe el follow y el que lo da
            userForUpdateFollower.followers.splice(followersIds, 1);
            userForUpdateFollower.updatedAt = new Date();
            userForUpdateFollower.markModified('updatedAt');
            await userForUpdateFollower.save();

            const indexOfuserForUpdate = currentUserLogged.following.findIndex(follower => follower._id + '' === userForUpdateFollower.id + '');

            currentUserLogged.following.splice(indexOfuserForUpdate, 1);
            currentUserLogged.updatedAt = new Date();
            currentUserLogged.markModified('updatedAt');
            await currentUserLogged.save();
        }
        // Se genera el token
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
    addOrRemoveFollower
}