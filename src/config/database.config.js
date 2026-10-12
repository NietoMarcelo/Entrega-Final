import mongoose from "mongoose";
import { MONGO_URI } from "./env.config.js";

export const conectToDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Conexión a la base de datos establecida");
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error);
    }
}