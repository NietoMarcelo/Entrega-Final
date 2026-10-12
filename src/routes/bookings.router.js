import { Router } from "express";
import {
    createBooking,
    getBookingById,
    addServiceToBooking,
} from "../controllers/bookings.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
    createBookingSchema,
    bookingIdParamsSchema,
    addServiceToBookingParamsSchema,
    addServiceToBookingBodySchema,
} from "../validations/booking.validation.js";

const router = Router();

router.post("/", validate({ body: createBookingSchema }), createBooking);
router.get("/:bid", validate({ params: bookingIdParamsSchema }), getBookingById);
router.post(
    "/:bid/services/:sid",
    validate({ params: addServiceToBookingParamsSchema, body: addServiceToBookingBodySchema }),
    addServiceToBooking
);

export default router;
