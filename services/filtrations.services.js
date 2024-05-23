"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDatesAndHoursOfMonth = exports.updateFiltrationsbyDate = exports.createAllDatesAndHoursOfYear = void 0;
const logging_1 = require("../logging");
const filtrations_model_1 = __importDefault(require("../models/filtrations.model"));
const datetime_1 = __importDefault(require("../utils/datetime"));
const error_handler_1 = __importDefault(require("../utils/error.handler"));
/**
 * @desc Creates energy records for all dates and hours of a given year.
 * @param year - The year for which to generate energy records.
 * @access PUBLIC
 */
const createAllDatesAndHoursOfYear = async (year) => {
    try {
        const filtrations = [];
        for (let month = 0; month < 12; month++) {
            const startDate = new Date(year, month, 1); // First day of the current month
            const endDate = new Date(year, month + 1, 0); // Last day of the current month
            for (let currentDate = startDate; currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
                const day = currentDate.getDate();
                const currentMonth = currentDate.getMonth() + 1; // Months are zero-based, so add 1
                const date = `${year}/${currentMonth}/${day}`;
                // console.log(`date: ${year}/${currentMonth}/${day}`);
                logging_1.consoleLogger?.info(`date: ${year}/${currentMonth}/${day}`);
                // Log the hours from 0 to 23
                for (let hour = 0; hour < 24; hour++) {
                    const formattedHour = hour < 10 ? "0" + hour : hour;
                    console.log(` hour : ${formattedHour}`);
                    logging_1.consoleLogger?.info(` hour : ${formattedHour}`);
                    filtrations.push({
                        year,
                        month: currentMonth,
                        date,
                        time: formattedHour,
                    });
                }
                // Add a separator for the next day
                // console.log("\nnext day\n");
                logging_1.consoleLogger?.info(`\nnext day\n`);
                // return ennergies;
            }
        }
        await filtrations_model_1.default.insertMany(filtrations);
        // console.log("save energie to db");
        logging_1.filtrationsLogger.info({ year }, `insert many filtrations of all year :${year} to DB`);
    }
    catch (error) {
        logging_1.filtrationsLogger.error(error, "createAllDatesAndHoursOfYear error");
        throw new error_handler_1.default(500, `createAllDatesAndHoursOfYear : ${error}`);
    }
};
exports.createAllDatesAndHoursOfYear = createAllDatesAndHoursOfYear;
/**
 * @desc Update Helioss by ID
 * @param message - The message containing energy data
 * @returns {Promise<void>}
 */
const updateFiltrationsbyDate = async function (message) {
    try {
        // Get the current date and time
        const currentDate = (0, datetime_1.default)();
        // Format the date as "YYYY/M/D"
        const date = `${currentDate.currentYear}/${currentDate.currentMonth}/${currentDate.currentDay}`;
        const time = `${currentDate.currentHour}`;
        // Extract Filtrations data from the message
        let filtration = message.toString().slice(0, 9);
        if (filtration[filtration.length - 1] === ".") {
            filtration = filtration.slice(0, filtration.length - 2);
        }
        try {
            // Update the Filtrations collection in MongoDB
            await filtrations_model_1.default.updateMany({ date }, // Filter criteria
            {
                filtration,
                message,
                last: true,
            } // Update data
            );
            logging_1.filtrationsLogger.info({ filtration, message, date, time }, `update the filtrations to ${filtration} in date: ${date} and time: ${time} is a success`);
        }
        catch (error) {
            // Handle MongoDB update error
            logging_1.filtrationsLogger.error(error, "Error update filtrations by date ");
            throw new error_handler_1.default(500, `updateFiltrations error: ${error}`);
        }
    }
    catch (error) {
        logging_1.filtrationsLogger.error(error, "Error updateFiltrations controller");
        // Handle other errors
        throw new error_handler_1.default(500, `updateFiltrations controller error: ${error}`);
    }
};
exports.updateFiltrationsbyDate = updateFiltrationsbyDate;
/**
 * @desc Creates energy records for all dates and hours of a given year and month.
 * @param year - The year for which to generate energy records.
 * @param month - The month for which to generate energy records (1-based index).
 * @access PUBLIC
 */
const generateDatesAndHoursOfMonth = async (year, month) => {
    try {
        // Determine the last day of the current month
        const lastDayOfMonth = new Date(year, month, 0).getDate();
        const filtrations = [];
        for (let day = 1; day <= lastDayOfMonth; day++) {
            const date = `${year}/${month}/${day}`;
            // Log the hours from 0 to 23
            for (let hour = 0; hour < 24; hour++) {
                const formattedHour = hour < 10 ? "0" + hour : hour;
                logging_1.consoleLogger?.info(`date: ${date}`);
                logging_1.consoleLogger?.info(` hour : ${formattedHour}`);
                filtrations.push({ year, month, date, time: formattedHour });
            }
            logging_1.consoleLogger?.info(`\nnext day\n`);
        }
        await filtrations_model_1.default.insertMany(filtrations);
        logging_1.filtrationsLogger.info(`iltrations save to DB success`);
    }
    catch (error) {
        logging_1.filtrationsLogger.info(error, "generateDatesAndHoursOfMonth error");
        throw new error_handler_1.default(500, `generateDatesAndHoursOfMonth: ${error}`);
    }
};
exports.generateDatesAndHoursOfMonth = generateDatesAndHoursOfMonth;
//# sourceMappingURL=filtrations.services.js.map