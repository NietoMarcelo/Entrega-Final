import http from "http";
import app from "./app.js";
import { PORT } from "./config/env.config.js";
import { conectToDB } from "./config/database.config.js";
import { initSocket } from "./config/socket.config.js";

const httpServer = http.createServer(app);
initSocket(httpServer);

const startServer = async () => {
    await conectToDB();
    httpServer.listen(PORT, () => {
        console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
};

startServer();
