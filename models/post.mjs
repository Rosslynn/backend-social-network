import mongoose from 'mongoose';
const { Schema, model } =  mongoose;

const postSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El usuario que crea el mensaje es requerido']
    },
    message: {
        type: String,
        required: [true, 'El mensaje es requerido']
    },
    file: {
        type: String
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    status:{
        type:Boolean,
        default:true
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

postSchema.methods.toJSON = function () {
    const {__v, _id, ...post} = this.toObject();
    post.id = _id;
    return post;
}

const Post = model('Post', postSchema);
export default Post;