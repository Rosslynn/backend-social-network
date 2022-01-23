import mongoose from 'mongoose';

const main = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/social_network');
        console.log('Connection established to the database...');
        
    } catch (error) {
        console.log(error);
        throw new Error('Error initializing the database....');
    }
}

export default main;