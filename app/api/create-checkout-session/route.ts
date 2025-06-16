
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-05-28.basil', // use a valid stable version
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { billing } = body;

        const amount = billing === 'annual' ? 800 : 1000; // in cents

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Pro Plan Subscription',
                        },
                        unit_amount: amount,
                    },
                    quantity: 1,
                },
            ],
            success_url: 'http://localhost:3000/success',
            cancel_url: 'http://localhost:3000/cancel',
        });

        return NextResponse.json({ id: session.id });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('[STRIPE_ERROR]', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }
}
