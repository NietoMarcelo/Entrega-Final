import { BookingsDAO } from "../dao/bookings.dao.js";

const bookingsDAO = new BookingsDAO();

export const getAllBookings = async () => {
    return await bookingsDAO.getBookings();
};

export const getBookingById = async (id) => {
    return await bookingsDAO.getBookingsById(id);
};

export const createBooking = async (bookingData) => {
    return await bookingsDAO.createBooking(bookingData);
};

export const addServiceToBooking = async (bookingId, serviceId, quantity) => {
    return await bookingsDAO.addServiceToBooking(bookingId, serviceId, quantity);
};
