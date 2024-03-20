import Stripe from "stripe";
import { config } from "dotenv";
config();

export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
console.log("Stripe secret key: ", STRIPE_SECRET_KEY);
const STRIPE_API_VERSION = "2023-08-16";

export const stripeConfig: Stripe.StripeConfig = {
    apiVersion: STRIPE_API_VERSION,
    typescript: true,
};
