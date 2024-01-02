"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhookRoutes = void 0;
const webhookService_1 = require("../services/webhookService");
const express_1 = require("express");
exports.webhookRoutes = (0, express_1.Router)();
exports.webhookRoutes.post("/webhook", webhookService_1.handleStripeWebhook);
