"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logNotFound = void 0;
const error_handler_1 = __importDefault(require("../utils/error.handler"));
function logNotFound(req, res) {
    // pageNotFoundLogger.info(`Page not found`, { url: req.path });
    res.status(404).json(new error_handler_1.default(404, "page not found")); // Send 404 response
}
exports.logNotFound = logNotFound;
//# sourceMappingURL=page.not.found.js.map