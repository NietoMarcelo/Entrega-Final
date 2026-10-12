import * as serviceService from "../service/service.service.js";
import { getIO } from "../config/socket.config.js";

const isNotFound = (error) => error.message.includes("no encontrado");

export const getServices = async (req, res) => {
    try {
        const query = req.validated?.query ?? req.query;
        const result = await serviceService.getAllServices(query);

        res.status(200).json({
            status: "success",
            payload: result.payload,
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al obtener los servicios" });
    }
};

export const getServiceById = async (req, res) => {
    try {
        const { sid } = req.params;
        const service = await serviceService.getServiceById(sid);

        res.status(200).json({ status: "success", payload: service });
    } catch (error) {
        const statusCode = isNotFound(error) ? 404 : 500;
        res.status(statusCode).json({ status: "error", message: error.message });
    }
};

export const createService = async (req, res) => {
    try {
        const service = await serviceService.createService(req.body);
        const io = getIO();
        if (io) {
            io.emit("serviceCreated", service);
        }
        res.status(201).json({ status: "success", payload: service });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
};

export const updateService = async (req, res) => {
    try {
        const { sid } = req.params;
        const service = await serviceService.updateService(sid, req.body);
        const io = getIO();
        if (io) {
            io.emit("serviceUpdated", service);
        }
        res.status(200).json({ status: "success", payload: service });
    } catch (error) {
        const statusCode = isNotFound(error) ? 404 : 400;
        res.status(statusCode).json({ status: "error", message: error.message });
    }
};

export const deleteService = async (req, res) => {
    try {
        const { sid } = req.params;
        await serviceService.deleteService(sid);

        res.status(200).json({ status: "success", message: "Servicio eliminado" });
    } catch (error) {
        const statusCode = isNotFound(error) ? 404 : 500;
        res.status(statusCode).json({ status: "error", message: error.message });
    }
};
