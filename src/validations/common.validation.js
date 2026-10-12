import { z } from "zod";

export const objectIdSchema = z
    .string({ required_error: "El id es obligatorio" })
    .regex(/^[a-fA-F0-9]{24}$/, "El id debe ser un ObjectId válido");
