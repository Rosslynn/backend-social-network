import { User, Role } from "../models/index.mjs";

const newUser = async (req, res) => {
    try {
        const { role, followers, picture, name, email, password  } = req.body;
        const user = new User({ name, email, password });
        await user.save();

        //TODO: Generar JWT y validación del mismo
     
        return res.status(201).json({
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

export {
    newUser
}