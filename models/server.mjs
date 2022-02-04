import express from "express";
import morgan from "morgan";
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import fileUpload from "express-fileupload";

import main from "../database/config.mjs";
import userRouter from "../routes/user.mjs";
import uploadsRouter from "../routes/upload.mjs";
import conversationsrouter from "../routes/conversation.mjs";
import messagesRouter from "../routes/message.mjs";

class Server {

    constructor() {
        this.app = express();
        this.paths = {
            users:'/users',
            uploads:'/uploads',
            conversations:'/conversations',
            messages:'/messages',
        }
        this.port = process.env.PORT || 8080;

        // Database connection
        this.databaseConnection();

        // Middlewares
        this.middlewares();

        // Routes
        this.routes();
    }

    middlewares() {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        this.app.use(cors());
        this.app.use(morgan('tiny')); 
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended:true }));
        this.app.use(fileUpload());
        this.app.use(express.static(path.join(__dirname, '../public')));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Server running on port', this.port);
        });
    }

    routes() {
        this.app.use(this.paths.users, userRouter);
        this.app.use(this.paths.uploads, uploadsRouter);
        this.app.use(this.paths.conversations, conversationsrouter);
        this.app.use(this.paths.messages, messagesRouter);
    }

    async databaseConnection() {
        await main();
    }

}

export default Server;