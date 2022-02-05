import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const options = {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
}
const userSchema = new Schema({
    name: {
        first: {
            type: String,
            trim:true,
            required: [true, 'Los nombres son obligatorios']
        },
        last: {
            type: String,
            trim:true,
            required: [true, 'Los apellidos son obligatorios']
        }
    },
    email: {
        type: String,
        required: [true, 'El correo electrónico es obligatorio'],
        unique: true,
        trim:true
    },
    password: {
        type: String,
        required: true
    },
    followers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    role: {
        type:String,
        uppercase:true,
        default:'USER',
        required:true
    },
    status: {
        type:Boolean,
        default:true
    },
    picture:{
        type:String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, options);

userSchema.virtual('fullName').get(function() {
    return `${this.name.first} ${this.name.last}`
});

userSchema.methods.toJSON = function () {
    const {__v, _id, password, ...user} = this.toObject();
    return user;
}

//Hash password
userSchema.methods.hashPassword = async function (password) {
    try {
        this.password = await bcrypt.hash(password, 10);
    } catch (error) {
        console.log(error);
    }
}

//Compare password
userSchema.methods.comparePasswords = async function (plainTextPassword) {
    try {
        return bcrypt.compare(plainTextPassword, this.password);
    } catch (error) {
        console.log(error);
    }
}


const User = model('User', userSchema);

export default User