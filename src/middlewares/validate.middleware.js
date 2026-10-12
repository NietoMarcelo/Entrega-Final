// Zod acá, así las rutas no se llenan de ifs
export const validate = (schemas = {}) => {
    return (req, res, next) => {
        try {
            req.validated = req.validated || {};

            if (schemas.body) {
                req.body = schemas.body.parse(req.body ?? {});
            }

            if (schemas.params) {
                schemas.params.parse(req.params);
            }

            if (schemas.query) {
                req.validated.query = schemas.query.parse(req.query);
            }

            next();
        } catch (error) {
            const message = error.issues
                ? error.issues.map((issue) => issue.message).join("; ")
                : "Datos inválidos";

            return res.status(400).json({
                status: "error",
                message,
            });
        }
    };
};
