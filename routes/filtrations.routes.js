"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const filtrations_controllers_1 = require("./../controllers/filtrations.controllers");
const express_1 = __importDefault(require("express"));
const validate_object_id_1 = require("../middlewares/validate.object.id");
// Initialize a new router instance
const filtrationRoutes = express_1.default.Router();
// Route for subscribing to MQTT messages using GET method
filtrationRoutes.get("/", filtrations_controllers_1.getLastFiltration);
filtrationRoutes.get("/all", filtrations_controllers_1.getFiltrations);
filtrationRoutes.get("/pagination", filtrations_controllers_1.getFiltrationsWithPagination);
filtrationRoutes.get("/year", filtrations_controllers_1.getFiltrationssByYear);
filtrationRoutes.get("/date", filtrations_controllers_1.getFiltrationsByDate);
filtrationRoutes.post("/", filtrations_controllers_1.createFiltrations);
filtrationRoutes.post("/year-month", filtrations_controllers_1.createFilrationsByYearAndMonth);
filtrationRoutes.put("/", filtrations_controllers_1.updateFiltartion);
filtrationRoutes.put("/:id", validate_object_id_1.validateObjectId, filtrations_controllers_1.resetFiltrationById);
filtrationRoutes.delete("/", filtrations_controllers_1.deleteFiltrationssByYear);
filtrationRoutes.delete("/year-month", filtrations_controllers_1.deleteFiltrationsByYearAndMonth);
filtrationRoutes.delete("/date", filtrations_controllers_1.deleteFiltrationsByDate);
// Export the router instance
exports.default = filtrationRoutes;
//# sourceMappingURL=filtrations.routes.js.map