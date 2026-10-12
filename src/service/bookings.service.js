import * as bookingsRepository from "../repository/bookings.repository.js";
import { getServiceById } from "./service.service.js";

export const getAllBookings = async () => {
    return await bookingsRepository.getAllBookings();
};

export const getBookingById = async (id) => {
    const booking = await bookingsRepository.getBookingById(id);

    if (!booking) {
        throw new Error("Reserva no encontrada");
    }

    return booking;
};

export const createBooking = async (bookingData) => {
    const payload = {
        clientName: bookingData.clientName,
        email: bookingData.email,
        date: bookingData.date,
        time: bookingData.time,
        status: bookingData.status,
        service: (bookingData.service || []).map((item) => ({
            service: item.service,
            quantity: item.quantity ?? 1
        }))
    };

    return await bookingsRepository.createBooking(payload);
};

export const addServiceToBooking = async (bookingId, serviceId, quantity = 1) => {
    const booking = await bookingsRepository.getBookingById(bookingId);

    if (!booking) {
        throw new Error("Reserva no encontrada");
    }

    await getServiceById(serviceId);

    return await bookingsRepository.addServiceToBooking(bookingId, serviceId, quantity);
};
