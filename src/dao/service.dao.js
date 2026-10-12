import { ServiceModel } from "./models/service.model.js";

export class ServiceDAO {
    async getServices({ filter = {}, page = 1, limit = 10, sort = {} } = {}) {
        const skip = (page - 1) * limit;

        const [docs, total] = await Promise.all([
            ServiceModel.find(filter).sort(sort).skip(skip).limit(limit),
            ServiceModel.countDocuments(filter)
        ]);

        const totalPages = Math.ceil(total / limit) || 0;

        return {
            payload: docs,
            total,
            page,
            limit,
            totalPages,
            hasPrevPage: page > 1,
            hasNextPage: page < totalPages
        };
    }

    async getServicesById(id) {
        return await ServiceModel.findById(id);
    }

    async createService(service) {
        return await ServiceModel.create(service);
    }

    async updateService(id, serviceData) {
        return await ServiceModel.findByIdAndUpdate(id, serviceData, { new: true, runValidators: true });
    }

    async deleteService(id) {
        return await ServiceModel.findByIdAndDelete(id);
    }
}
