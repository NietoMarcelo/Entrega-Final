import { ServiceDAO } from "../dao/service.dao.js";

const serviceDAO = new ServiceDAO();

export const getAllServices = async (options) => {
    return await serviceDAO.getServices(options);
};

export const getServiceById = async (sid) => {
    return await serviceDAO.getServicesById(sid);
};

export const createService = async (serviceData) => {
    return await serviceDAO.createService(serviceData);
};

export const updateService = async (sid, serviceData) => {
    return await serviceDAO.updateService(sid, serviceData);
};

export const deleteService = async (sid) => {
    return await serviceDAO.deleteService(sid);
};
