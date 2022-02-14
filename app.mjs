import AppServer from "./models/server.mjs";
import dotenv from 'dotenv';

dotenv.config();

const server = new AppServer();
server.listen();
