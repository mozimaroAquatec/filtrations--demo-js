"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Define the schema for the users collection
const filtrationsSchema = new mongoose_1.default.Schema({
    message: { type: String, default: "00.00:000.00:00:00", required: true },
    filtration: { type: String, default: "00.00:000", required: true },
    year: { type: String, required: true },
    month: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    last: { type: Boolean, default: false, required: true },
}, { timestamps: true } // Enable timestamps for createdAt and updatedAt fields
);
// Create a model based on the schema, named 'Users', with the specified interface
const Filtrations = mongoose_1.default.model("filtration", filtrationsSchema);
exports.default = Filtrations;
//# sourceMappingURL=filtrations.model.js.map