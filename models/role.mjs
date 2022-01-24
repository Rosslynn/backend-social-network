import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const roleSchema = new Schema({
    role: {
        type:String,
        required:true,
        unique:true,
        uppercase:true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

roleSchema.methods.toJSON = function () {
    const {__v, ...roleData } = this.toObject();
    return roleData;
}

const Role = model('Role',roleSchema);
export default Role;