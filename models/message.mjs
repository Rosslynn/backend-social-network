import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const messageSchema = new Schema({
    owner:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required:[true,'El usuario que crea el mensaje es requerido']
    },
    conversation: {
        type: Schema.Types.ObjectId,
        ref: 'Conversation',
        required:[true, 'La conversación a la que pertenece este mensaje es requerida']
    },
    message: {
        type:String,
        required:[true, 'El mensaje es requerido']
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


messageSchema.methods.toJSON = function () {
    const {__v, _id, ...message} = this.toObject();
    message.id = _id;
    return message;
}

const Message = model('Message', messageSchema);
export default Message;

//TODO: Crear la propiedad data (información del mensaje) busacr en internet si existe la propiedad textarea y cifrar este contenido con bcrypt a la hora de crear el mensaje