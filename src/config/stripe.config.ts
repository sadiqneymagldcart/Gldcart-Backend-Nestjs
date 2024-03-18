import Stripe from "stripe";

export const STRIPE_SECRET_KEY =
    "sk_test_51LwMMSIr9qomMnpIgv956EjoyG9MPMpJVD0baydsnLLoIitrdjdCvyYhlzecEvE9k8qR1FtAR75ffZ111P8tQILZ008AuRZGJp";
const STRIPE_API_VERSION = "2023-08-16";

export const stripeConfig: Stripe.StripeConfig = {
    apiVersion: STRIPE_API_VERSION,
    typescript: true,
};
