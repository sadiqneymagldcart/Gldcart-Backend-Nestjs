import Stripe from "stripe";

export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY as string;
const STRIPE_API_VERSION = "2023-08-16";

export const stripeConfig: Stripe.StripeConfig = {
    apiVersion: STRIPE_API_VERSION,
    typescript: true,
};
