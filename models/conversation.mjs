import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const conversationSchema = new Schema({
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
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

const Conversation = model('Conversation', conversationSchema);
export default Conversation;