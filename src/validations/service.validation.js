import { z } from "zod";
import { objectIdSchema } from "./common.validation.js";

export const createServiceSchema = z.object({
    name: z
        .string({ required_error: "El nombre es obligatorio" })
        .trim()
        .min(1, "El nombre no puede estar vacío"),
    description: z
        .string({ required_error: "La descripción es obligatoria" })
        .trim()
        .min(1, "La descripción no puede estar vacía"),
    price: z
        .number({
            required_error: "El precio es obligatorio",
            invalid_type_error: "El precio debe ser un número",
        })
        .positive("El precio debe ser mayor a 0"),
    duration: z
        .number({
            required_error: "La duración es obligatoria",
            invalid_type_error: "La duración debe ser un número",
        })
        .int("La duración debe ser un número entero")
        .positive("La duración debe ser mayor a 0"),
    available: z.boolean({
        required_error: "El campo available es obligatorio",
        invalid_type_error: "available debe ser true o false",
    }),
    category: z
        .string({ required_error: "La categoría es obligatoria" })
        .trim()
        .min(1, "La categoría no puede estar vacía"),
});

export const updateServiceSchema = createServiceSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
        message: "Debés enviar al menos un campo para actualizar",
    });

export const serviceIdParamsSchema = z.object({
    sid: objectIdSchema,
});

export const getServicesQuerySchema = z.object({
    category: z.string().trim().min(1).optional(),
    available: z
        .enum(["true", "false", "1", "0"], {
            errorMap: () => ({ message: "available debe ser true o false" }),
        })
        .transform((value) => value === "true" || value === "1")
        .optional(),
    page: z.coerce
        .number({ invalid_type_error: "page debe ser un número" })
        .int("page debe ser un número entero")
        .positive("page debe ser mayor a 0")
        .optional()
        .default(1),
    limit: z.coerce
        .number({ invalid_type_error: "limit debe ser un número" })
        .int("limit debe ser un número entero")
        .positive("limit debe ser mayor a 0")
        .max(100, "limit no puede ser mayor a 100")
        .optional()
        .default(10),
    sortBy: z
        .enum(["name", "price", "duration", "category", "available", "createdAt"], {
            errorMap: () => ({
                message: "sortBy debe ser name, price, duration, category, available o createdAt",
            }),
        })
        .optional()
        .default("name"),
    order: z
        .enum(["asc", "desc"], {
            errorMap: () => ({ message: "order debe ser asc o desc" }),
        })
        .optional()
        .default("asc"),
});
