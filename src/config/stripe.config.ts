export interface StripeConfig {
    secretKey: string;
    apiVersion: string;
    typescript: boolean;
}

export const stripeConfig: StripeConfig = {
    secretKey: process.env.STRIPE_SECRET_KEY as string,
    apiVersion: "2023-08-16",
    typescript: true,
};

