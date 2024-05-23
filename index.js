"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const error_handler_1 = __importDefault(require("./utils/error.handler")); // Importing custom error handler
const connect_db_1 = __importDefault(require("./config/connect.db")); // Importing MongoDB connection function
const cors_1 = __importDefault(require("cors"));
require("./config/env.config");
const page_not_found_1 = require("./middlewares/page.not.found");
const logging_1 = require("./logging");
const mqtt_services_1 = __importDefault(require("./services/mqtt.services"));
const filtrationsServices = __importStar(require("./services/filtrations.services"));
const filtrations_routes_1 = __importDefault(require("./routes/filtrations.routes"));
// Creating an Express app
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Connecting to MongoDB
(0, connect_db_1.default)();
// Initialize MQTT client
const mqttClient = (0, mqtt_services_1.default)();
// Event handler for MQTT client when it's connected to the broker
mqttClient.on("connect", async () => {
    logging_1.mqttLogger.info("connected to MQTT broker");
});
// Subscribing to a MQTT topic
mqttClient.subscribe("Filtrations", () => {
    logging_1.mqttLogger.info("Subscribed to Filtrations");
});
// Event handler for receiving MQTT messages
mqttClient.on("message", async (topic, message) => {
    logging_1.mqttLogger.info({ topic, message: message.toString() }, `received message from topic : ${topic} and the message is :${message.toString()}`);
    // Extract amplitude and attitude from the message
    try {
        await filtrationsServices.updateFiltrationsbyDate(message.toString());
    }
    catch (error) {
        logging_1.filtrationsLogger.error(error, "update filtration error catch out controller");
        throw new error_handler_1.default(500, `updateiltrations error : ${error}`);
    }
    // Call geolocation service with the extracted amplitude and attitude
    // Publish the current date buffer to the "Geolocations" topic
});
app.use("/", filtrations_routes_1.default);
app.use(page_not_found_1.logNotFound);
// Starting the server and listening on the specified port
app.listen(process.env.PORT, () => {
    logging_1.serverLogger.info(`Server is running on port ${process.env.PORT}`);
});
//# sourceMappingURL=index.js.map