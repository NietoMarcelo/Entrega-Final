import * as repository from "../repository/service.repository.js";

export const getAllServices = async (query = {}) => {
    const {
        category,
        available,
        page = 1,
        limit = 10,
        sortBy = "name",
        order = "asc"
    } = query;

    const filter = {};

    if (category) {
        filter.category = category;
    }

    if (available !== undefined) {
        filter.available = available;
    }

    const sort = {
        [sortBy]: order === "desc" ? -1 : 1
    };

    return await repository.getAllServices({ filter, page, limit, sort });
};

export const getServiceById = async (sid) => {
    const service = await repository.getServiceById(sid);

    if (!service) {
        throw new Error("Servicio no encontrado");
    }

    return service;
};

export const createService = async (serviceData) => {
    return await repository.createService(serviceData);
};

export const updateService = async (sid, serviceData) => {
    const service = await repository.getServiceById(sid);

    if (!service) {
        throw new Error("Servicio no encontrado");
    }

    const { id, _id, ...safeData } = serviceData;

    return await repository.updateService(sid, safeData);
};

export const deleteService = async (sid) => {
    const service = await repository.getServiceById(sid);

    if (!service) {
        throw new Error("Servicio no encontrado");
    }

    return await repository.deleteService(sid);
};
