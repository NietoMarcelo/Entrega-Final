import * as serviceService from "../service/service.service.js";
import * as bookingService from "../service/bookings.service.js";

const mapService = (service) => {
    const data = service.toObject ? service.toObject() : service;
    return {
        ...data,
        id: data._id,
        availableText: data.available ? "Disponible" : "No disponible",
        availableAttr: data.available ? "true" : "false"
    };
};

const mapBooking = (booking) => {
    const data = booking.toObject ? booking.toObject() : booking;
    return {
        ...data,
        id: data._id,
        dateText: new Date(data.date).toLocaleDateString("es-AR"),
        servicesCount: data.service?.length || 0
    };
};

export const renderServices = async (req, res) => {
    try {
        const result = await serviceService.getAllServices({ page: 1, limit: 50 });
        const mapped = (result.payload || []).map(mapService);
        res.render("services", {
            title: "Servicios",
            services: mapped,
            hasServices: mapped.length > 0
        });
    } catch (error) {
        res.status(500).send("Error al cargar los servicios");
    }
};

export const renderAvailability = async (req, res) => {
    try {
        const [servicesResult, bookings] = await Promise.all([
            serviceService.getAllServices({ page: 1, limit: 50 }),
            bookingService.getAllBookings()
        ]);

        const mappedServices = (servicesResult.payload || []).map(mapService);
        const mappedBookings = bookings.map(mapBooking);

        res.render("availability", {
            title: "Disponibilidad",
            services: mappedServices,
            bookings: mappedBookings,
            hasServices: mappedServices.length > 0,
            hasBookings: mappedBookings.length > 0
        });
    } catch (error) {
        res.status(500).send("Error al cargar la disponibilidad");
    }
};
