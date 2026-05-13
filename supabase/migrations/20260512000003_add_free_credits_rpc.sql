-- RPC: add_free_credits
-- Adds free test credits to a user's wallet without payment.
-- Used for testing/demo purposes only.
CREATE OR REPLACE FUNCTION public.add_free_credits(
  p_user_id TEXT,
  p_amount INTEGER
)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_wallet_id TEXT;
  v_current_balance INTEGER;
  v_new_balance INTEGER;
BEGIN
  -- Find or create wallet for this user
  SELECT id, COALESCE(balance, 0) INTO v_wallet_id, v_current_balance
  FROM public."TutorWallet"
  WHERE "tutorId" = p_user_id;

  IF NOT FOUND THEN
    v_wallet_id := gen_random_uuid()::TEXT;
    v_current_balance := 0;
    INSERT INTO public."TutorWallet" (id, "tutorId", balance, "createdAt", "updatedAt")
    VALUES (v_wallet_id, p_user_id, 0, now(), now());
  END IF;

  v_new_balance := v_current_balance + p_amount;

  UPDATE public."TutorWallet"
  SET balance = v_new_balance, "updatedAt" = now()
  WHERE id = v_wallet_id;

  INSERT INTO public."WalletTransaction" (id, "walletId", type, source, amount, "balanceAfter", "createdAt")
  VALUES (gen_random_uuid()::TEXT, v_wallet_id, 'CREDIT', 'ADJUSTMENT', p_amount, v_new_balance, now());

  RETURN jsonb_build_object('success', true, 'balance', v_new_balance, 'amount', p_amount);
END;
$$;
