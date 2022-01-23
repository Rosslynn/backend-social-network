import { User } from "../models/index.mjs";

const newUser = async (req, res) => {
    try {
        const user = new User({
            name: {
                first: req.body.name.first,
                last:req.body.name.last
            },
            email:req.body.email
        });
        await user.save();

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