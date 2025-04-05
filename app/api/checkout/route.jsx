import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { priceId } = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        priceId: priceId,
      },
      success_url: `${req.headers.get("origin")}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/cancel`,
    });

    // Return both the session ID and the complete URL
    return Response.json(
      {
        sessionId: session.id,
        sessionUrl: session.url,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Stripe Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
