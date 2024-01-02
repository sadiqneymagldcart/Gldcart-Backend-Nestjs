"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVehicle = exports.updateVehicle = exports.getAllVehicles = exports.getVehicleById = exports.createVehicle = void 0;
const vehicleService_1 = __importDefault(require("../services/vehicleService"));
const createVehicle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newVehicle = req.body;
        const createdVehicle = yield vehicleService_1.default.createVehicle(newVehicle);
        res.json(createdVehicle);
    }
    catch (err) {
        next(err);
    }
});
exports.createVehicle = createVehicle;
const getVehicleById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vehicleId = req.params.id;
        const vehicle = yield vehicleService_1.default.getVehicleById(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        res.json(vehicle);
    }
    catch (err) {
        next(err);
    }
});
exports.getVehicleById = getVehicleById;
const getAllVehicles = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vehicles = yield vehicleService_1.default.getAllVehicles();
        res.json(vehicles);
    }
    catch (err) {
        next(err);
    }
});
exports.getAllVehicles = getAllVehicles;
const updateVehicle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vehicleId = req.params.id;
        const updatedVehicleData = req.body;
        const updatedVehicle = yield vehicleService_1.default.updateVehicle(vehicleId, updatedVehicleData);
        if (!updatedVehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        res.json(updatedVehicle);
    }
    catch (err) {
        next(err);
    }
});
exports.updateVehicle = updateVehicle;
const deleteVehicle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vehicleId = req.params.id;
        const deletedVehicle = yield vehicleService_1.default.deleteVehicle(vehicleId);
        if (!deletedVehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        res.json({ message: 'Vehicle deleted successfully' });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteVehicle = deleteVehicle;
