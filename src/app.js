import express from "express";
import { engine } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import servicesRouter from "./routes/services.router.js";
import bookingsRouter from "./routes/bookings.router.js";
import viewsRouter from "./routes/views.router.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Sin esto, req.body llega vacío cuando mandan JSON desde Postman
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

app.engine("handlebars", engine({
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views/layouts")
}));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.get("/health", (req, res) => {
    res.json({ status: "ok", message: "Servidor activo" });
});

// Montamos cada router bajo su prefijo
app.use("/api/services", servicesRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/views", viewsRouter);

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({ status: "error", message: "JSON inválido" });
    }

    next(err);
});

export default app;
