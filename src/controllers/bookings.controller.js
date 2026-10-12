import * as bookingService from "../service/bookings.service.js";
import { getIO } from "../config/socket.config.js";

export const createBooking = async (req, res) => {
    try {
        const booking = await bookingService.createBooking(req.body);
        const io = getIO();
        if (io) {
            io.emit("bookingCreated", booking);
        }
        res.status(201).json({ status: "success", payload: booking });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
};

export const getBookingById = async (req, res) => {
    try {
        const { bid } = req.params;
        const booking = await bookingService.getBookingById(bid);

        res.status(200).json({ status: "success", payload: booking });
    } catch (error) {
        const statusCode = error.message.includes("no encontrada") ? 404 : 500;
        res.status(statusCode).json({ status: "error", message: error.message });
    }
};

export const addServiceToBooking = async (req, res) => {
    try {
        const { bid, sid } = req.params;
        const quantity = req.body?.quantity ?? 1;
        const booking = await bookingService.addServiceToBooking(bid, sid, quantity);
        res.status(200).json({ status: "success", payload: booking });
    } catch (error) {
        const statusCode = error.message.includes("no encontrad") ? 404 : 400;
        res.status(statusCode).json({ status: "error", message: error.message });
    }
};
