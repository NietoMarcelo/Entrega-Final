import { z } from "zod";
import { objectIdSchema } from "./common.validation.js";

const bookingServiceItemSchema = z.object({
    service: objectIdSchema,
    quantity: z
        .number({ invalid_type_error: "quantity debe ser un número" })
        .int("quantity debe ser un número entero")
        .positive("quantity debe ser mayor a 0")
        .optional()
        .default(1),
});

export const createBookingSchema = z.object({
    clientName: z
        .string({ required_error: "El nombre del cliente es obligatorio" })
        .trim()
        .min(1, "El nombre del cliente no puede estar vacío"),
    email: z
        .string({ required_error: "El email es obligatorio" })
        .trim()
        .email("El email no es válido"),
    date: z
        .string({ required_error: "La fecha es obligatoria" })
        .refine((value) => !Number.isNaN(Date.parse(value)), {
            message: "La fecha no es válida",
        }),
    time: z
        .string({ required_error: "La hora es obligatoria" })
        .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "La hora debe tener formato HH:MM"),
    status: z.enum(["pending", "confirmed", "cancelled"], {
        errorMap: () => ({
            message: "El estado debe ser pending, confirmed o cancelled",
        }),
    }),
    service: z.array(bookingServiceItemSchema).optional().default([]),
});

export const bookingIdParamsSchema = z.object({
    bid: objectIdSchema,
});

export const addServiceToBookingParamsSchema = z.object({
    bid: objectIdSchema,
    sid: objectIdSchema,
});

export const addServiceToBookingBodySchema = z.object({
    quantity: z
        .number({ invalid_type_error: "quantity debe ser un número" })
        .int("quantity debe ser un número entero")
        .positive("quantity debe ser mayor a 0")
        .optional()
        .default(1),
});
