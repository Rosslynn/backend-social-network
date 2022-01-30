import Server from "./models/server.mjs";
import dotenv from 'dotenv';

dotenv.config();

const server = new Server();
server.listen();
