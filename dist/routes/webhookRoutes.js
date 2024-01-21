"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookRoutes = void 0;
const webhookService_1 = require("../services/stripe/webhookService");
class WebhookRoutes {
    constructor(router, path) {
        this.path = path;
        this.router = router;
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(`${this.path}`, webhookService_1.handleStripeWebhook);
    }
}
exports.WebhookRoutes = WebhookRoutes;
