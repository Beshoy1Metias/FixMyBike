import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-02-25.clover",
});

export const getStripeSession = async (sessionId: string): Promise<Stripe.Checkout.Session> => {
    return await stripe.checkout.sessions.retrieve(sessionId);
};
