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
exports.deleteFiltrationsByDate = exports.deleteFiltrationsByYearAndMonth = exports.deleteFiltrationssByYear = exports.resetFiltrationById = exports.updateFiltartion = exports.getLastFiltration = exports.getFiltrationsByDate = exports.getFiltrationssByYear = exports.getFiltrationsWithPagination = exports.getFiltrations = exports.createFilrationsByYearAndMonth = exports.createFiltrations = void 0;
// Importing necessary modules
const error_handler_1 = __importDefault(require("../utils/error.handler")); // Importing custom error handler
const filtrations_model_1 = __importDefault(require("../models/filtrations.model")); // Importing Helioss model
const filtrationsServices = __importStar(require("../services/filtrations.services"));
const year_validation_1 = require("../utils/year-validation");
const filtrations_schemas_1 = require("../utils/schemas/filtrations.schemas");
const success_response_1 = require("../utils/success.response");
const logging_1 = require("../logging");
/**
 * @desc inserts filtrations  records for all dates and hours of a given year into the database.
 * @param POST
 * @access PUBLIC
 */
const createFiltrations = async function (req, res) {
    try {
        let { year } = req.body;
        // Validating input data from client
        const { error } = (0, filtrations_schemas_1.yearSchema)(req.body);
        if (error)
            return res
                .status(400)
                .json(new error_handler_1.default(400, `${error.details[0].message}`));
        if (typeof year === "string") {
            year = parseInt(year);
        }
        const checkYear = (0, year_validation_1.isValidYear)(year);
        if (!checkYear)
            return res.status(400).json({ status: "false", message: "invalid year" });
        // Generate filtrations records for the specified year
        await filtrationsServices.createAllDatesAndHoursOfYear(year);
        logging_1.filtrationsLogger.info({ year }, `insert many filtrations of all year :${year} to DB`);
        return res
            .status(201)
            .json(new success_response_1.SuccessResponse(201, "filtrations created successfully"));
    }
    catch (error) {
        // Handle errors
        res.status(500).json(new error_handler_1.default(500, "Internal server error"));
        logging_1.filtrationsLogger.error(error, "createFiltrations error");
        throw new error_handler_1.default(500, `createFiltrations error: ${error}`);
    }
};
exports.createFiltrations = createFiltrations;
/**
 * @desc Controller function to create energy records for all dates and hours of a given year and month.
 * @param POST
 * @access PUBLIC
 */
const createFilrationsByYearAndMonth = async function (req, res) {
    try {
        // Extract year and month from request body
        let { year, month } = req.body;
        // Validating input data from client
        const { error } = (0, filtrations_schemas_1.filtrationsByYearAndMonthSchema)(req.body);
        if (error)
            return res
                .status(400)
                .json(new error_handler_1.default(400, `${error.details[0].message}`));
        if (typeof year === "string") {
            year = parseInt(year);
        }
        if (typeof month === "string") {
            month = parseInt(month);
        }
        const checkYear = (0, year_validation_1.isValidYear)(year);
        if (!checkYear)
            return res.status(400).json({ status: "false", message: "invalid year" });
        // Generate energy records for the specified year
        await filtrationsServices.generateDatesAndHoursOfMonth(year, month);
        logging_1.filtrationsLogger.info({ year, month }, `filtrations created by year: ${year} and month: ${month} successfully`);
        return res
            .status(201)
            .json(new success_response_1.SuccessResponse(201, "filtartions created by year and month successfully"));
    }
    catch (error) {
        // Handle errors
        res.status(500).json(new error_handler_1.default(500, "Internal server error"));
        throw new error_handler_1.default(500, `createEenrgies error: ${error}`);
    }
};
exports.createFilrationsByYearAndMonth = createFilrationsByYearAndMonth;
/**
 * @desc  Controller function to handle getting all filtrations
 * @param GET /
 * @param PUBLIC
 **/
const getFiltrations = async function (req, res) {
    try {
        // Query the database for all filtrations records
        const filtrations = await filtrations_model_1.default.find().select("-updatedAt -createdAt -message -year -month -last");
        logging_1.filtrationsLogger.info("get all filtrations succcess");
        // Return success response with filtrations data
        return res.status(200).json(filtrations);
    }
    catch (error) {
        // Handle errors
        res.status(500).json(new error_handler_1.default(500, "Internal server error"));
        logging_1.filtrationsLogger.error(error, "get all filtrations errorr");
        throw new error_handler_1.default(500, `getFiltrations error : ${error}`);
    }
};
exports.getFiltrations = getFiltrations;
/**
 * @desc Controller function to handle getting filtrations with pagination
 * @param GET /pagination
 * @param PUBLIC
 **/
const getFiltrationsWithPagination = async function (req, res) {
    try {
        const currentPage = parseInt(req.query.currentPage) || 1;
        const pageSize = parseInt(req.query.pageSize) || 50;
        const pagesCount = Math.ceil((await filtrations_model_1.default.find().select("-updatedAt -createdAt -message -year -month -last")).length / pageSize);
        logging_1.consoleLogger?.info({ pagesCount }, "pagesCount");
        if (!pagesCount) {
            return res.status(200).json([]);
        }
        if (pagesCount < currentPage)
            return res
                .status(400)
                .json(new error_handler_1.default(400, `current page must be smaller than pages count : ${pagesCount}`));
        // Query the database for all Filtrattion records
        const filtrattions = await filtrations_model_1.default.find()
            .skip((currentPage - 1) * pageSize)
            .limit(pageSize) // pagination
            .select("-updatedAt -createdAt -message -year");
        logging_1.filtrationsLogger.info({ currentPage, pageSize, pagesCount }, "get all filtrations by pagination success");
        // Return success response with filtrattions data
        return res.status(200).json(filtrattions);
    }
    catch (error) {
        // Handle errors
        res.status(500).json(new error_handler_1.default(500, "Internal server error"));
        logging_1.filtrationsLogger.error(error, "get all filtrations with pagination errorr");
        throw new error_handler_1.default(500, `getFiltrationsWithPagination error : ${error}`);
    }
};
exports.getFiltrationsWithPagination = getFiltrationsWithPagination;
/**
 * @desc Get Energies from the database by year
 * @param GET /year
 * @param PUBLIC
 **/
const getFiltrationssByYear = async function (req, res) {
    try {
        let { year } = req.query;
        // Validating input data from client
        const { error } = (0, filtrations_schemas_1.yearSchema)(req.query);
        if (error)
            return res
                .status(400)
                .json(new error_handler_1.default(400, `${error.details[0].message}`));
        const checkYear = (0, year_validation_1.isValidYear)(parseInt(year));
        if (!checkYear)
            return res.status(400).json(new error_handler_1.default(400, "invalid year"));
        // Query the database for all Energies records
        const filtrations = await filtrations_model_1.default.find({ year }).select("-message -year -month -last -updatedAt -createdAt");
        // Return success response with Energies data
        return res.status(200).json(filtrations);
    }
    catch (error) {
        // Handle errors
        res.status(500).json(new error_handler_1.default(500, "Internal server error"));
        throw new error_handler_1.default(500, `getEnergies error : ${error}`);
    }
};
exports.getFiltrationssByYear = getFiltrationssByYear;
/**
 * @desc  Controller function to get energies by date and time
 * @method GET /date-time/
 * @param PUBLIC
 **/
const getFiltrationsByDate = async function (req, res) {
    try {
        let { date } = req.query;
        // Validating input data from client
        const { error } = (0, filtrations_schemas_1.dateSchema)(req.query);
        if (error)
            return res
                .status(400)
                .json(new error_handler_1.default(400, `${error.details[0].message}`));
        // Query the database for all Energies records
        const filtration = await filtrations_model_1.default.find({ date }).select("-message -year -month -last -updatedAt -createdAt");
        // Return success response with Energies data
        return res.status(200).json(filtration);
    }
    catch (error) {
        // Handle errors
        res.status(500).json(new error_handler_1.default(500, "Internal server error"));
        throw new error_handler_1.default(500, `getEnergies error : ${error}`);
    }
};
exports.getFiltrationsByDate = getFiltrationsByDate;
/**
 * @desc  Controller function to get energies by date and time
 * @method GET /date-time/
 * @param PUBLIC
 **/
const getLastFiltration = async function (req, res) {
    try {
        // Query the database for all Energies records
        const filtration = await filtrations_model_1.default.findOne({ last: true }).select("-message -year -month -last -updatedAt -createdAt -time");
        logging_1.filtrationsLogger.info("get last filtrations success");
        // Return success response with Energies data
        return res.status(200).json(filtration);
    }
    catch (error) {
        // Handle errors
        res.status(500).json(new error_handler_1.default(500, "Internal server error"));
        throw new error_handler_1.default(500, `getEnergies error : ${error}`);
    }
};
exports.getLastFiltration = getLastFiltration;
/**
 * @desc Update an energy record based on the provided message
 * @param PUT /
 * @access PUBLIC
 **/
const updateFiltartion = async function (req, res) {
    try {
        const { message } = req.body;
        // Validate the input data using the updateEnergieSchema
        const { error } = (0, filtrations_schemas_1.updateFiltrationsSchema)(req.body);
        if (error)
            return res
                .status(400)
                .json(new error_handler_1.default(400, `${error.details[0].message}`));
        // Call the service function to update the energy record
        await filtrationsServices.updateFiltrationsbyDate(message);
        logging_1.filtrationsLogger.info("update Filtration success");
        // Return a success response
        return res
            .status(200)
            .json(new success_response_1.SuccessResponse(200, "updated filtration success"));
    }
    catch (error) {
        // Handle errors
        res.status(500).json(new error_handler_1.default(500, "Internal server error"));
        logging_1.filtrationsLogger.error(error, "updateFiltartion error");
        throw new error_handler_1.default(500, `updateFiltartion error : ${error}`);
    }
};
exports.updateFiltartion = updateFiltartion;
/**
 * @desc reset energie by message
 * @param PUT /:id
 * @access PUBLIC
 **/
const resetFiltrationById = async function (req, res) {
    try {
        await filtrations_model_1.default.findByIdAndUpdate(req.params.id, {
            message: "00.00:000.00:00:00",
            energie: "00.00:000",
        });
        logging_1.filtrationsLogger.info("reset filtration by id success");
        return res
            .status(200)
            .json({ status: "success", message: "reset filtration by id success" });
    }
    catch (error) {
        // Handle errors
        res.status(500).json(new error_handler_1.default(500, "Internal server error"));
        logging_1.filtrationsLogger.error(error, "resetFiltrationById errorr");
        throw new error_handler_1.default(500, `resetFiltrationById error : ${error}`);
    }
};
exports.resetFiltrationById = resetFiltrationById;
/**
 * @desc delete filtrations by year
 * @param DELETE /
 * @access PUBLIC
 **/
const deleteFiltrationssByYear = async function (req, res) {
    try {
        const { year } = req.query;
        // Validating input data from client
        const { error } = (0, filtrations_schemas_1.yearSchema)(req.query);
        if (error)
            return res
                .status(400)
                .json(new error_handler_1.default(400, `${error.details[0].message}`));
        const existEnrgies = await filtrations_model_1.default.find({ year });
        if (!existEnrgies.length) {
            return res
                .status(404)
                .json(new error_handler_1.default(404, "filtrations record does not exist"));
        }
        await filtrations_model_1.default.deleteMany({ year });
        logging_1.filtrationsLogger.info({ year }, `delete filtrations by year :${year} success`);
        return res
            .status(200)
            .json(new success_response_1.SuccessResponse(200, "filtrations deleted successfully"));
    }
    catch (error) {
        // Handle errors
        res.status(500).json(new error_handler_1.default(500, "Internal server error"));
        logging_1.filtrationsLogger.error({ error }, `delete filtrations by year error`);
        throw new error_handler_1.default(500, `deleteFiltrationsyYear error : ${error}`);
    }
};
exports.deleteFiltrationssByYear = deleteFiltrationssByYear;
/**
 * @desc delete enrgies by year
 * @param DELETE /year-month
 * @access PUBLIC
 **/
const deleteFiltrationsByYearAndMonth = async function (req, res) {
    try {
        const { year, month } = req.query;
        // Validating input data from client
        const { error } = (0, filtrations_schemas_1.filtrationsByYearAndMonthSchema)(req.query);
        if (error)
            return res
                .status(400)
                .json(new error_handler_1.default(400, `${error.details[0].message}`));
        const existEnrgie = await filtrations_model_1.default.find({ $and: [{ year }, { month }] });
        if (!existEnrgie.length) {
            return res
                .status(404)
                .json(new error_handler_1.default(404, "Energy record does not exist."));
        }
        await filtrations_model_1.default.deleteMany({ $and: [{ year }, { month }] });
        return res
            .status(200)
            .json(new success_response_1.SuccessResponse(200, "energies deleted successfully"));
    }
    catch (error) {
        // Handle errors
        res.status(500).json(new error_handler_1.default(500, "Internal server error"));
        throw new error_handler_1.default(500, `deleteEnergiesByYearAndMonth error : ${error}`);
    }
};
exports.deleteFiltrationsByYearAndMonth = deleteFiltrationsByYearAndMonth;
/**
 * @desc delete enrgies by year
 * @param DELETE /date
 * @access PUBLIC
 **/
const deleteFiltrationsByDate = async function (req, res) {
    try {
        const { date } = req.query;
        const existDate = await filtrations_model_1.default.findOne({ date });
        if (!existDate) {
            return res
                .status(404)
                .json(new error_handler_1.default(404, "Energy record does not exist"));
        }
        // Validating input data from client
        const { error } = (0, filtrations_schemas_1.filtrationsByDateSchema)(req.query);
        if (error)
            return res
                .status(400)
                .json(new error_handler_1.default(400, `${error.details[0].message}`));
        await filtrations_model_1.default.deleteMany({ date });
        return res
            .status(200)
            .json(new success_response_1.SuccessResponse(200, "energies deleted successfully"));
    }
    catch (error) {
        // Handle errors
        res.status(500).json(new error_handler_1.default(500, "Internal server error"));
        throw new error_handler_1.default(500, `deleteEnergiesByDate error : ${error}`);
    }
};
exports.deleteFiltrationsByDate = deleteFiltrationsByDate;
//# sourceMappingURL=filtrations.controllers.js.map