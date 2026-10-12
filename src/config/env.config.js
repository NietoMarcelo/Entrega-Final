import dotenv from "dotenv";
dotenv.config();

// Config simple de entorno (sin secretos).
// Más adelante acá van cosas como PORT, URI de Mongo, etc.
export const PORT = process.env.PORT || 8080;
export const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/mi_base_de_datos";