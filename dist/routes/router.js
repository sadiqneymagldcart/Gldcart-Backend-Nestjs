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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController = __importStar(require("../controllers/userController"));
const rateLimitMiddleware_1 = require("../middlewares/rateLimitMiddleware");
const paymentController = __importStar(require("../controllers/paymentController"));
const authMiddleware = __importStar(require("../middlewares/authMiddleware"));
const vehicleController = __importStar(require("../controllers/vehicleController"));
const router = (0, express_1.Router)();
// Auth routes
router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/refresh", userController.refresh);
//GoogleAuth routes
router.get("/tokens/oauth/google", userController.googleOauthHandler);
// Reset password routes
router.post("/forgot-password", userController.initiatePasswordReset);
router.post("/reset-password/:token", userController.resetPasswordWithToken);
router.post("/reset-password", userController.resetPasswordWithEmail);
//Email routes
router.post("/send-contact-email", authMiddleware.requireAuth, rateLimitMiddleware_1.rateLimitMiddlewareTyped, userController.sendContactEmail);
//Payment routes
router.post("/create-checkout-session", authMiddleware.requireAuth, paymentController.createPaymentCheckout);
router.post("/create-subscription-checkout", authMiddleware.requireAuth, paymentController.createSubscriptionCheckout);
router.post("/cancel-subscription", authMiddleware.requireAuth, paymentController.cancelSubscription);
router.get("/get-customer", authMiddleware.requireAuth, paymentController.createCustomer);
router.post("/webhook", paymentController.handleStripeWebhook);
//Addresses routes
router.post("/add-address", authMiddleware.requireAuth, userController.addAddress);
router.get("/get-addresses/:id", authMiddleware.requireAuth, userController.getAddresses);
router.put("/update-address", authMiddleware.requireAuth, userController.updateAddress);
//Personal details routes
router.put("/update-personal-details", authMiddleware.requireAuth, userController.updatePersonalDetails);
//Vehicle routes
router.post('/vehicle', authMiddleware.requireAuth, vehicleController.createVehicle);
router.get('/vehicles/:id', authMiddleware.requireAuth, vehicleController.getVehicleById);
router.get('/vehicles', authMiddleware.requireAuth, vehicleController.getAllVehicles);
router.put('/vehicles/:id', authMiddleware.requireAuth, vehicleController.updateVehicle);
router.delete('/vehicles/:id', authMiddleware.requireAuth, vehicleController.deleteVehicle);
exports.default = router;
