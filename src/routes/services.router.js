import { Router } from "express";
import {
    getServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
} from "../controllers/services.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
    createServiceSchema,
    updateServiceSchema,
    serviceIdParamsSchema,
    getServicesQuerySchema,
} from "../validations/service.validation.js";

const router = Router();

router.get("/", validate({ query: getServicesQuerySchema }), getServices);
router.get("/:sid", validate({ params: serviceIdParamsSchema }), getServiceById);
router.post("/", validate({ body: createServiceSchema }), createService);
router.put("/:sid", validate({ params: serviceIdParamsSchema, body: updateServiceSchema }), updateService);
router.delete("/:sid", validate({ params: serviceIdParamsSchema }), deleteService);

export default router;
