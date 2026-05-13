import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@17.7.0?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  httpClient: Stripe.createFetchHttpClient(),
});

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const PUBLIC_SITE_URL = Deno.env.get("PUBLIC_SITE_URL") || "http://localhost:3000";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

Deno.serve(async (req) => {
  try {
    const { userId, email, amount, currency } = await req.json();

    if (!userId || !amount || amount <= 0) {
      return new Response(
        JSON.stringify({ error: "Invalid userId or amount" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const amountCents = Math.round(parseFloat(amount) * 100);
    const currencyLower = (currency || "aed").toLowerCase();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: currencyLower,
            product_data: { name: "Wallet Credits" },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      customer_email: email || undefined,
      success_url: `${PUBLIC_SITE_URL}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${PUBLIC_SITE_URL}/payments/cancel`,
      metadata: { userId, amount: String(amountCents) },
    });

    const { error: insertError } = await supabase.from("Payment").insert({
      tutorId: userId,
      email: email || null,
      amount: amountCents,
      currency: currencyLower,
      provider: "stripe",
      providerPaymentId: session.id,
      status: "INITIATED",
      metadata: { amount_input: amount },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    if (insertError) {
      console.error("Failed to insert payment record:", insertError);
    }

    return new Response(
      JSON.stringify({ paymentUrl: session.url, sessionId: session.id }),
      { headers: { "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});
