"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pino_1 = __importDefault(require("pino"));
const path_1 = __importDefault(require("path"));
// Import pino-mongodb but we don't need to use it directly
require("pino-mongodb");
const os_1 = __importDefault(require("os"));
const ip_1 = __importDefault(require("ip"));
const createProdLogger = (serviceName) => {
    // Function to get the local IP address
    const serverIp = ip_1.default.address();
    // Get the hostname of the local machine
    const serverHostname = os_1.default.hostname();
    const logTransport = pino_1.default.transport({
        targets: [
            {
                target: "pino/file",
                options: {
                    destination: path_1.default.join(__dirname, `./logs/${serviceName}.log`),
                    mkdir: true,
                },
                level: process.env.PINO_LOG_LEVEL,
            },
            {
                target: "pino-mongodb",
                options: {
                    uri: process.env.MONGO_URI_LOGGER, // Use the logger-specific URI
                    database: process.env.DB_LOGGER_NAME, // Use a different database for logging
                    collection: serviceName,
                    level: process.env.PINO_LOG_LEVEL,
                },
                level: process.env.PINO_LOG_LEVEL,
            },
        ],
    });
    return (0, pino_1.default)({
        level: process.env.PINO_LOG_LEVEL,
        base: {
            service: serviceName,
            environment: process.env.NODE_ENV,
            serverIp, // Include serverIp in the log message
            serverHostname, // Include serverHostname in the log message
        },
        timestamp: pino_1.default.stdTimeFunctions.isoTime,
    }, logTransport);
};
exports.default = createProdLogger;
//# sourceMappingURL=logger.prod.js.map