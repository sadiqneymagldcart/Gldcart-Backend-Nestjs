import {authRoutes} from "../routes/authRoutes";
import {passwordRoutes} from "../routes/passwordRoutes";
import {cartRoutes} from "../routes/cartRoutes";
import {addressesRoutes} from "../routes/addressesRoutes";
import {emailRoutes} from "../routes/emailRoutes";
import {paymentRoutes} from "../routes/paymentRoutes";
import {personalDetailRoutes} from "../routes/personalDetailsRoutes";
import {vehicleRoutes} from "../routes/vehicleRoutes";
import {subscriptionRoutes} from "../routes/subscriptionRoutes";
import {webhookRoutes} from "../routes/webhookRoutes";
import express from "express";


export function configureRoutes(app: express.Express): void {
    app.use('/auth', authRoutes);
    app.use('/password', passwordRoutes);
    app.use('/addresses', addressesRoutes);
    app.use('/email', emailRoutes);
    app.use('/payment', paymentRoutes);
    app.use('/personalDetail', personalDetailRoutes);
    app.use('/vehicle', vehicleRoutes);
    app.use('/subscription', subscriptionRoutes);
    app.use('/webhook', webhookRoutes);
    app.use('/cart', cartRoutes);
}
