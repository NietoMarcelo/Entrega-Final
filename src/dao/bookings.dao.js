import { BookingModel } from "./models/booking.model.js";

export class BookingsDAO {
    async getBookings() {
        return await BookingModel.find().populate("service.service");
    }

    async getBookingsById(id) {
        return await BookingModel.findById(id).populate("service.service");
    }

    async createBooking(bookingData) {
        const booking = await BookingModel.create(bookingData);
        return await booking.populate("service.service");
    }

    async addServiceToBooking(bookingId, serviceId, quantity = 1) {
        const booking = await BookingModel.findById(bookingId);

        if (!booking) {
            return null;
        }

        const existingItem = booking.service.find(
            (item) => item.service.toString() === serviceId.toString()
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            booking.service.push({ service: serviceId, quantity });
        }

        await booking.save();
        return await booking.populate("service.service");
    }
}
