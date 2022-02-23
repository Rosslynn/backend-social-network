import dotenv from 'dotenv';
import * as cloudinary from 'cloudinary';

import AppServer from "./models/server.mjs";

dotenv.config();

const server = new AppServer();
server.listen();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/* (async () => {
    try {
        const response = await cloudinary.v2.uploader.upload("./pictures/no-image.jpg",  { 
            folder:'pictures',
            public_id:'no-image'
        }
        );
        console.log(response);
    } catch (error) {
        console.log(error);
    }
})() */
