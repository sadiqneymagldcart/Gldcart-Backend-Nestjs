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
const logger_1 = require("../util/logger");
const Product_1 = __importDefault(require("../models/Product"));
class ProductService {
    constructor() {
        this.logger = new logger_1.Logger();
    }
    getAllProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.logger.logInfo('Getting all products');
                return yield Product_1.default.find();
            }
            catch (error) {
                this.logger.logError(`Error fetching all products: ${error.message}`);
                throw error;
            }
        });
    }
    getProductById(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.logger.logInfo(`Getting product with ID: ${productId}`);
                return yield Product_1.default.findById(productId);
            }
            catch (error) {
                this.logger.logError(`Error fetching product with ID ${productId}: ${error.message}`);
                throw error;
            }
        });
    }
    createProduct(productData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.logger.logInfo('Creating new product');
                const newProduct = yield Product_1.default.create(productData);
                return newProduct;
            }
            catch (error) {
                this.logger.logError(`Error creating product: ${error.message}`);
                throw error;
            }
        });
    }
    updateProduct(productId, updatedData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.logger.logInfo(`Updating product with ID: ${productId}`);
                return yield Product_1.default.findByIdAndUpdate(productId, updatedData, { new: true });
            }
            catch (error) {
                this.logger.logError(`Error updating product with ID ${productId}: ${error.message}`);
                throw error;
            }
        });
    }
    deleteProduct(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.logger.logInfo(`Deleting product with ID: ${productId}`);
                const result = yield Product_1.default.deleteOne({ _id: productId });
                return result.deletedCount !== 0;
            }
            catch (error) {
                this.logger.logError(`Error deleting product with ID ${productId}: ${error.message}`);
                throw error;
            }
        });
    }
    searchProductsByCategory(category) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.logger.logInfo(`Searching products by category: ${category}`);
                return yield Product_1.default.find({ category });
            }
            catch (error) {
                this.logger.logError(`Error searching products by category ${category}: ${error.message}`);
                throw error;
            }
        });
    }
}
exports.default = new ProductService();
