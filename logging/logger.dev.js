"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pino_1 = __importDefault(require("pino"));
const pino_pretty_1 = __importDefault(require("pino-pretty"));
/**
 * Creates a development logger with pretty printing and colored output.
 *
 * @param serviceName - The name of the service for which the logger is created.
 * @returns A configured Pino logger instance.
 */
const createDevLogger = (serviceName) => {
    const stream = (0, pino_pretty_1.default)({
        colorize: true,
        translateTime: "SYS:standard",
    });
    const logger = (0, pino_1.default)({
        name: serviceName,
        level: process.env.PINO_LOG_LEVEL,
        serializers: {
            err: pino_1.default.stdSerializers.err,
        },
    }, stream);
    return logger;
};
exports.default = createDevLogger;
//# sourceMappingURL=logger.dev.js.map