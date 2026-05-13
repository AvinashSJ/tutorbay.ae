import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@17.7.0?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  httpClient: Stripe.createFetchHttpClient(),
});

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

Deno.serve(async (req) => {
  try {
    const sig = req.headers.get("stripe-signature");
    if (!sig) {
      return new Response("Missing stripe-signature header", { status: 400 });
    }

    const body = await req.text();
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;
    const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const paymentIntentId = session.payment_intent as string | null;
        const isPaid = session.payment_status === "paid";
        const newStatus = isPaid ? "SUCCEEDED" : "PENDING";

        await supabase
          .from("Payment")
          .update({
            status: newStatus,
            stripePaymentIntentId: paymentIntentId,
            updatedAt: new Date().toISOString(),
          })
          .eq("providerPaymentId", session.id);

        if (isPaid) {
          await creditWalletFromSession(session);
        }
        break;
      }

      case "checkout.session.expired": {
        const expiredSession = event.data.object as Stripe.Checkout.Session;
        await supabase
          .from("Payment")
          .update({ status: "CANCELLED", updatedAt: new Date().toISOString() })
          .eq("providerPaymentId", expiredSession.id);
        break;
      }

      case "payment_intent.succeeded": {
        const pi = event.data.object as Stripe.PaymentIntent;
        await supabase
          .from("Payment")
          .update({
            status: "SUCCEEDED",
            stripePaymentIntentId: pi.id,
            updatedAt: new Date().toISOString(),
          })
          .eq("stripePaymentIntentId", pi.id);
        break;
      }

      case "payment_intent.payment_failed": {
        const failedPi = event.data.object as Stripe.PaymentIntent;
        await supabase
          .from("Payment")
          .update({ status: "FAILED", updatedAt: new Date().toISOString() })
          .eq("stripePaymentIntentId", failedPi.id);
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});

async function creditWalletFromSession(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const amountCents = session.metadata?.amount;
  if (!userId || !amountCents) return;

  const amount = Math.round(parseInt(amountCents) / 100);

  const { data: wallet } = await supabase
    .from("TutorWallet")
    .select("id, balance")
    .eq("tutorId", userId)
    .single();

  if (wallet) {
    const newBalance = (wallet.balance || 0) + amount;
    await supabase
      .from("TutorWallet")
      .update({ balance: newBalance, updatedAt: new Date().toISOString() })
      .eq("id", wallet.id);

    await supabase.from("WalletTransaction").insert({
      walletId: wallet.id,
      type: "CREDIT",
      source: "RECHARGE",
      amount,
      balanceAfter: newBalance,
      referenceId: session.id,
      createdAt: new Date().toISOString(),
    });
  } else {
    const walletId = crypto.randomUUID();
    await supabase.from("TutorWallet").insert({
      id: walletId,
      tutorId: userId,
      balance: amount,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await supabase.from("WalletTransaction").insert({
      walletId,
      type: "CREDIT",
      source: "RECHARGE",
      amount,
      balanceAfter: amount,
      referenceId: session.id,
      createdAt: new Date().toISOString(),
    });
  }
}
