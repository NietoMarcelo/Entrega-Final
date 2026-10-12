import { Server } from "socket.io";

let io = null;

export const initSocket = (httpServer) => {
    io = new Server(httpServer);

    io.on("connection", (socket) => {
        console.log("alguien se conectó:", socket.id);
    });

    return io;
};

export const getIO = () => io;
