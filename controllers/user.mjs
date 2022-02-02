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
        const dbUser = await User.findById(id).populate({ path: 'followers', model:'User'});
    
        return res.status(201).json({
            ok:true,
            user:dbUser
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
          User.find({ status:true }).skip(+from).limit(limit).populate({ path: 'followers', model:'User'})
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
        const dbUser = await User.findById(id).populate('followers');;

        if (!dbUser.status) {
            return res.status(400).json({
                ok:false,
                msg:`La cuenta de ${dbUser.fullName} ya se encuentra inactiva.`
            });
        }

         //Date types using built-in methods, tell mongoose about the change with doc.markModified('pathToYourDate') before saving.
        const updatedDate = new Date();
        dbUser.status = false;
        dbUser.updatedAt = updatedDate;
        dbUser.markModified('updatedAt');
        await dbUser.save();

        return res.status(200).json({
            ok:true,
            msg:`La cuenta de ${dbUser.fullName} a partir de este momento ${updatedDate.toLocaleString()} se encuentra inactiva.`
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
        const dbUser = await User.findById(id).populate('followers');;
        const comparePassword = await dbUser.comparePasswords(password);

        if (!comparePassword) {
            return res.status(400).json({
                ok:false,
                msg:'Contraseña incorrecta'
            });
        }

        dbUser.email = email;
        dbUser.updatedAt =  new Date();
        dbUser.markModified('updatedAt');
        await dbUser.save();

        const token = await generateJWT(dbUser.id);
    
        return res.status(200).json({
            ok:true,
            token,
            user:dbUser
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
        const dbUser = await User.findById(id).populate('followers');;
        const comparePassword = await dbUser.comparePasswords(password);

        if (!comparePassword) {
            return res.status(400).json({
                ok:false,
                msg:'La contraseña que escribiste es incorrecta'
            });
        }

        await dbUser.hashPassword(new_password);
        dbUser.updatedAt =  new Date();
        dbUser.markModified('updatedAt');
        await dbUser.save();

        const token = await generateJWT(dbUser.id);
    
        return res.status(200).json({
            ok:true,
            token,
            user:dbUser
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
        const dbUser = await User.findById(id).populate('followers');;
    
        dbUser.role = role;
        dbUser.updatedAt =  new Date();
        dbUser.markModified('updatedAt');
        await dbUser.save();

        const token = await generateJWT(dbUser.id);
    
        return res.status(200).json({
            ok:true,
            token,
            user:dbUser
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

export {
    newUser,
    getUsers,
    userLogin,
    deleteUser,
    updateBasicInfo,
    updatePassword,
    updateRole,
    getSingleUser
}