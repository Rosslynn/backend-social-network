import express from "express";
import morgan from "morgan";
import { createServer } from "http";
import { Server } from "socket.io";
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import fileUpload from "express-fileupload";

import main from "../database/config.mjs";
import userRouter from "../routes/user.mjs";
import uploadsRouter from "../routes/upload.mjs";
import conversationsrouter from "../routes/conversation.mjs";
import messagesRouter from "../routes/message.mjs";
import postsRouter from "../routes/post.mjs";

class AppServer {

    constructor() {
        this.app = express();
        this.Server = createServer(this.app);
        this.io = new Server(this.Server, {
            cors: {
                origin: "http://localhost:4200"
            }
        });
        this.paths = {
            users:'/users',
            uploads:'/uploads',
            conversations:'/conversations',
            messages:'/messages',
            posts:'/posts'
        }
        this.port = process.env.PORT || 8080;

        // Database connection
        this.databaseConnection();

        // Middlewares
        this.middlewares();

        // Routes
        this.routes();

        // Sockets
        this.ioSockets();
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
        this.Server.listen(this.port, () => {
            console.log('Server running on port', this.port);
        });
        
        this.ioSockets();
    }

    routes() {
        this.app.use(this.paths.users, userRouter);
        this.app.use(this.paths.uploads, uploadsRouter);
        this.app.use(this.paths.conversations, conversationsrouter);
        this.app.use(this.paths.messages, messagesRouter);
        this.app.use(this.paths.posts, postsRouter);
    }

    ioSockets() {
        this.io.on("connection", (socket) => {
           socket.emit('message','hola mundo');
        }); 
    }

    async databaseConnection() {
        await main();
    }

}

export default AppServer;