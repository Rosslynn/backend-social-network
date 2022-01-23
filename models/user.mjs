import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const options = {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
}
const userSchema = new Schema({
    name: {
        first: {
            type: String,
            required: [true, 'Los nombres son obligatorios']
        },
        last: {
            type: String,
            required: [true, 'Los apellidos son obligatorios']
        }
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, options);

userSchema.virtual('fullName').get(function() {
    return `${this.name.first} ${this.name.last}`
});

userSchema.methods.toJSON = function () {
    const {__v, _id, ...user} = this.toObject();
    return user;
}

const User = model('User', userSchema);

export default User