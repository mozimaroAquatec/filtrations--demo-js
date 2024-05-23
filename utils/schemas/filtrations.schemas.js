"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filtrationsByDateSchema = exports.filtrationsByYearAndMonthSchema = exports.updateFiltrationsSchema = exports.dateAndTimeSchema = exports.yearSchema = exports.dateSchema = void 0;
const joi_1 = __importDefault(require("joi"));
/**
 * @desc Validates whether the input year is a number or a string.
 * @param year - The year to validate.
 * @returns {Joi.ValidationResult} - The validation result.
 */
/*======= dateSchema ========*/
const dateSchema = (date) => {
    const schema = joi_1.default.object({
        date: joi_1.default.required(),
    });
    return schema.validate(date);
};
exports.dateSchema = dateSchema;
/*=======// dateSchema //========*/
/*======= yearSchema ========*/
const yearSchema = (year) => {
    const schema = joi_1.default.object({
        year: joi_1.default.required(),
    });
    return schema.validate(year);
};
exports.yearSchema = yearSchema;
/*=======// yearSchema //========*/
/*======= dateAndTimeSchema ========*/
const dateAndTimeSchema = (obj) => {
    const schema = joi_1.default.object({
        date: joi_1.default.string().required(),
        time: joi_1.default.string().required(),
    });
    return schema.validate(obj);
};
exports.dateAndTimeSchema = dateAndTimeSchema;
/*=======// dateAndTimeSchema //========*/
/*======= updateFiltrationsSchema ========*/
const updateFiltrationsSchema = (obj) => {
    const schema = joi_1.default.object({
        message: joi_1.default.string().required(),
    });
    return schema.validate(obj);
};
exports.updateFiltrationsSchema = updateFiltrationsSchema;
/*=======// updateFiltrationsSchema //========*/
/*======= FiltrationsByYearAndMonthSchema ========*/
const filtrationsByYearAndMonthSchema = (obj) => {
    const schema = joi_1.default.object({
        year: joi_1.default.required(),
        month: joi_1.default.required(),
    });
    return schema.validate(obj);
};
exports.filtrationsByYearAndMonthSchema = filtrationsByYearAndMonthSchema;
/*=======// FiltrationsByYearAndMonthSchema //========*/
/*======= FiltrationsByDateSchema ========*/
const filtrationsByDateSchema = (date) => {
    const schema = joi_1.default.object({
        date: joi_1.default.string().required(),
    });
    return schema.validate(date);
};
exports.filtrationsByDateSchema = filtrationsByDateSchema;
/*=======// FiltrationsByDateSchema //========*/
//# sourceMappingURL=filtrations.schemas.js.map