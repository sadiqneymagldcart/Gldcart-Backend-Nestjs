"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRoutes = void 0;
const express_1 = require("express");
const productController_1 = require("../controllers/shop/productController");
exports.productRoutes = (0, express_1.Router)();
exports.productRoutes.get('/products', productController_1.getAllProducts);
exports.productRoutes.get('/products/:productId', productController_1.getProductById);
exports.productRoutes.post('/product', productController_1.createProduct);
exports.productRoutes.put('/products/:productId', productController_1.updateProduct);
exports.productRoutes.delete('/products/:productId', productController_1.deleteProduct);
