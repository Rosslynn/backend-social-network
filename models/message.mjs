import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const messageSchema = new Schema({
    owner:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    conversation: {
        type: Schema.Types.ObjectId,
        ref: 'Conversation'
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

const Message = model('Message', messageSchema);
export default Message;

//TODO: Crear la propiedad data (información del mensaje) busacr en internet si existe la propiedad textarea y cifrar este contenido con bcrypt a la hora de crear el mensaje