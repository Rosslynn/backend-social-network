import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const conversationSchema = new Schema({
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required:[true,'El id del participante de esta conversación es obligatorio']
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

conversationSchema.methods.toJSON = function () {
    const {__v, _id, ...conversation} = this.toObject();
    conversation.id = _id;
    return conversation;
}

const Conversation = model('Conversation', conversationSchema);
export default Conversation;