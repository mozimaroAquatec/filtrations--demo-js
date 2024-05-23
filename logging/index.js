"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentDateLogger = exports.filtrationsLogger = exports.consoleLogger = exports.mqttLogger = exports.DBLogger = exports.serverLogger = exports.usersLoggers = void 0;
const logger_dev_1 = __importDefault(require("./logger.dev"));
const logger_prod_1 = __importDefault(require("./logger.prod"));
// Determine the environment and create the appropriate logger factory
const logger = process.env.NODE_ENV === "production" ? logger_prod_1.default : logger_dev_1.default;
// Create specific loggers for different services
exports.usersLoggers = logger("users");
exports.serverLogger = logger("server");
exports.DBLogger = logger("DB");
exports.mqttLogger = logger("mqtt");
exports.consoleLogger = process.env.NODE_ENV === "production" ? null : logger("console");
exports.filtrationsLogger = logger("filtrations");
exports.currentDateLogger = logger("currentDate");
exports.default = logger;
//# sourceMappingURL=index.js.map