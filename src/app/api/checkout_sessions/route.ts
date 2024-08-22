import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(request: Request) {
  const body = await request.json();
  console.log('NEXT_PUBLIC_BASE_URL:', process.env.NEXT_PUBLIC_BASE_URL);
  console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY);
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: body.name,
              description: 'Training session with expert trainer', // Description shown on the payment page
            },
            unit_amount: body.amount, // amount in cents
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL!}/success?session_id={CHECKOUT_SESSION_ID}&slot_id=${body.slot_id}&level_id=${body.level_id}&service_id=${body.service_id}&date=${body.date}&email=${body.email}&trainer_id=${body.trainer_id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL!}/cancel`,
    });

    return NextResponse.json({ id: session.id });
  } catch (error) {
    console.error('Error creating Stripe session:', error);
    return new NextResponse('Error creating Stripe session', { status: 500 });
  }
}

  