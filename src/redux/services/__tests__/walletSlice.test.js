import { configureStore } from "@reduxjs/toolkit";
import { walletApi } from "../walletSlice";

const mockSupabase = {
  auth: {
    getUser: jest.fn(),
    getSession: jest.fn(),
  },
  from: jest.fn(),
  rpc: jest.fn(),
};

jest.mock("@/libs/supabase", () => ({
  getSupabase: jest.fn(() => mockSupabase),
}));

function createTestStore() {
  return configureStore({
    reducer: {
      [walletApi.reducerPath]: walletApi.reducer,
    },
    middleware: (gdm) => gdm().concat(walletApi.middleware),
  });
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe("getWalletBalance", () => {
  test("returns 401 error when not authenticated", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } });

    const store = createTestStore();
    const result = await store.dispatch(walletApi.endpoints.getWalletBalance.initiate());

    expect(result.error).toBeTruthy();
    expect(result.error.status).toBe(401);
    expect(result.error.data).toBe("Not authenticated");
  });

  test("returns 404 with balance 0 when no wallet row found", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: "u1" } } });
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: { message: "not found" } }),
    });

    const store = createTestStore();
    const result = await store.dispatch(walletApi.endpoints.getWalletBalance.initiate());

    expect(result.error).toBeTruthy();
    expect(result.error.status).toBe(404);
  });

  test("returns wallet balance on success", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: "u1" } } });
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: { id: "w1", balance: 42, updatedAt: "2025-01-01" }, error: null }),
    });

    const store = createTestStore();
    const result = await store.dispatch(walletApi.endpoints.getWalletBalance.initiate());

    expect(result.data).toEqual({ id: "w1", balance: 42, updatedAt: "2025-01-01" });
    expect(result.error).toBeUndefined();
  });
});

describe("getTransactions", () => {
  test("returns 404 when wallet not found", async () => {
    mockSupabase.from.mockImplementation(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: { message: "Wallet not found" } }),
    }));

    const store = createTestStore();
    const result = await store.dispatch(walletApi.endpoints.getTransactions.initiate("u1"));

    expect(result.error).toBeTruthy();
    expect(result.error.status).toBe(404);
    expect(result.error.data).toBe("Wallet not found");
  });

  test("returns 500 when transaction query fails", async () => {
    mockSupabase.from.mockImplementation((table) => {
      if (table === "TutorWallet") {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: { id: "w1" }, error: null }),
        };
      }
      return {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
      };
    });
    // Second call to from('WalletTransaction') fails
    const walletSelect = { id: "w1" };
    mockSupabase.from
      .mockImplementationOnce(() => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: walletSelect, error: null }),
      }))
      .mockImplementationOnce(() => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: null, error: { message: "DB error" } }),
      }));

    const store = createTestStore();
    const result = await store.dispatch(walletApi.endpoints.getTransactions.initiate("u1"));

    expect(result.error).toBeTruthy();
    expect(result.error.status).toBe(500);
    expect(result.error.data).toBe("DB error");
  });

  test("returns transactions on success", async () => {
    const txs = [{ id: "tx1", type: "DEBIT", amount: 4, balanceAfter: 11 }];
    mockSupabase.from
      .mockImplementationOnce(() => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: { id: "w1" }, error: null }),
      }))
      .mockImplementationOnce(() => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: txs, error: null }),
      }));

    const store = createTestStore();
    const result = await store.dispatch(walletApi.endpoints.getTransactions.initiate("u1"));

    expect(result.data).toEqual(txs);
    expect(result.error).toBeUndefined();
  });
});

describe("getUnlockedRequirements", () => {
  test("returns 401 when not authenticated", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } });

    const store = createTestStore();
    const result = await store.dispatch(walletApi.endpoints.getUnlockedRequirements.initiate());

    expect(result.error).toBeTruthy();
    expect(result.error.status).toBe(401);
  });

  test("returns 500 when RPC fails", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: "u1" } } });
    mockSupabase.rpc.mockResolvedValue({ data: null, error: { message: "RPC error" } });

    const store = createTestStore();
    const result = await store.dispatch(walletApi.endpoints.getUnlockedRequirements.initiate());

    expect(result.error).toBeTruthy();
    expect(result.error.status).toBe(500);
    expect(result.error.data).toBe("RPC error");
  });

  test("returns empty array when no data", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: "u1" } } });
    mockSupabase.rpc.mockResolvedValue({ data: null, error: null });

    const store = createTestStore();
    const result = await store.dispatch(walletApi.endpoints.getUnlockedRequirements.initiate());

    expect(result.data).toEqual([]);
    expect(result.error).toBeUndefined();
  });

  test("returns unlocked requirements on success", async () => {
    const unlocked = [{ requirementId: "r1", parentName: "Alice" }];
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: "u1" } } });
    mockSupabase.rpc.mockResolvedValue({ data: unlocked, error: null });

    const store = createTestStore();
    const result = await store.dispatch(walletApi.endpoints.getUnlockedRequirements.initiate());

    expect(result.data).toEqual(unlocked);
  });
});

describe("unlockRequirementContact", () => {
  const payload = { requirementId: "r1" };

  test("returns 401 when not authenticated", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } });

    const store = createTestStore();
    const result = await store.dispatch(walletApi.endpoints.unlockRequirementContact.initiate(payload));

    expect(result.error).toBeTruthy();
    expect(result.error.status).toBe(401);
  });

  test("returns 500 when RPC throws error", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: "u1" } } });
    mockSupabase.rpc.mockResolvedValue({ data: null, error: { message: "Insufficient credits" } });

    const store = createTestStore();
    const result = await store.dispatch(walletApi.endpoints.unlockRequirementContact.initiate(payload));

    expect(result.error).toBeTruthy();
    expect(result.error.status).toBe(500);
    expect(result.error.data).toBe("Insufficient credits");
  });

  test("returns 400 when RPC returns success=false", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: "u1" } } });
    mockSupabase.rpc.mockResolvedValue({ data: { success: false, error: "Already unlocked" }, error: null });

    const store = createTestStore();
    const result = await store.dispatch(walletApi.endpoints.unlockRequirementContact.initiate(payload));

    expect(result.error).toBeTruthy();
    expect(result.error.status).toBe(400);
    expect(result.error.data).toBe("Already unlocked");
  });

  test("returns 400 with default error when RPC returns success=false without error", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: "u1" } } });
    mockSupabase.rpc.mockResolvedValue({ data: { success: false }, error: null });

    const store = createTestStore();
    const result = await store.dispatch(walletApi.endpoints.unlockRequirementContact.initiate(payload));

    expect(result.error).toBeTruthy();
    expect(result.error.status).toBe(400);
    expect(result.error.data).toBe("Unlock failed");
  });

  test("returns data on success", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: "u1" } } });
    mockSupabase.rpc.mockResolvedValue({ data: { success: true, contact: "alice@test.com" }, error: null });

    const store = createTestStore();
    const result = await store.dispatch(walletApi.endpoints.unlockRequirementContact.initiate(payload));

    expect(result.data).toEqual({ success: true, contact: "alice@test.com" });
  });
});

describe("unlockTutorContact", () => {
  const payload = { tutorId: "t1" };

  test("returns 401 when not authenticated", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } });

    const store = createTestStore();
    const result = await store.dispatch(walletApi.endpoints.unlockTutorContact.initiate(payload));

    expect(result.error).toBeTruthy();
    expect(result.error.status).toBe(401);
  });

  test("returns 500 when RPC throws error", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: "u1" } } });
    mockSupabase.rpc.mockResolvedValue({ data: null, error: { message: "RPC failed" } });

    const store = createTestStore();
    const result = await store.dispatch(walletApi.endpoints.unlockTutorContact.initiate(payload));

    expect(result.error).toBeTruthy();
    expect(result.error.status).toBe(500);
  });

  test("returns 400 when success=false", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: "u1" } } });
    mockSupabase.rpc.mockResolvedValue({ data: { success: false, error: "Insufficient credits" }, error: null });

    const store = createTestStore();
    const result = await store.dispatch(walletApi.endpoints.unlockTutorContact.initiate(payload));

    expect(result.error).toBeTruthy();
    expect(result.error.status).toBe(400);
  });

  test("returns data on success", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: "u1" } } });
    mockSupabase.rpc.mockResolvedValue({ data: { success: true, contact: "tutor@test.com" }, error: null });

    const store = createTestStore();
    const result = await store.dispatch(walletApi.endpoints.unlockTutorContact.initiate(payload));

    expect(result.data).toEqual({ success: true, contact: "tutor@test.com" });
  });
});

describe("addFreeCredits", () => {
  const payload = { amount: 100 };

  test("returns 401 when not authenticated", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } });

    const store = createTestStore();
    const result = await store.dispatch(walletApi.endpoints.addFreeCredits.initiate(payload));

    expect(result.error).toBeTruthy();
    expect(result.error.status).toBe(401);
  });

  test("returns 500 when RPC fails", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: "u1" } } });
    mockSupabase.rpc.mockResolvedValue({ data: null, error: { message: "RPC error" } });

    const store = createTestStore();
    const result = await store.dispatch(walletApi.endpoints.addFreeCredits.initiate(payload));

    expect(result.error).toBeTruthy();
    expect(result.error.status).toBe(500);
  });

  test("returns data on success", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: "u1" } } });
    mockSupabase.rpc.mockResolvedValue({ data: { success: true, balance: 115 }, error: null });

    const store = createTestStore();
    const result = await store.dispatch(walletApi.endpoints.addFreeCredits.initiate(payload));

    expect(result.data).toEqual({ success: true, balance: 115 });
  });
});

describe("createPayment", () => {
  const paymentData = { amount: 100, currency: "AED" };

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  test("returns 401 when no session", async () => {
    mockSupabase.auth.getSession.mockResolvedValue({ data: { session: null } });

    const store = createTestStore();
    const result = await store.dispatch(walletApi.endpoints.createPayment.initiate(paymentData));

    expect(result.error).toBeTruthy();
    expect(result.error.status).toBe(401);
  });

  test("returns error status when HTTP request fails", async () => {
    mockSupabase.auth.getSession.mockResolvedValue({ data: { session: { access_token: "tok" } } });
    global.fetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: jest.fn().mockResolvedValue({ error: "Server error" }),
    });

    const store = createTestStore();
    const result = await store.dispatch(walletApi.endpoints.createPayment.initiate(paymentData));

    expect(result.error).toBeTruthy();
    expect(result.error.status).toBe(500);
    expect(result.error.data).toBe("Server error");
  });

  test("returns default error message when no server error provided", async () => {
    mockSupabase.auth.getSession.mockResolvedValue({ data: { session: { access_token: "tok" } } });
    global.fetch.mockResolvedValue({
      ok: false,
      status: 400,
      json: jest.fn().mockResolvedValue({}),
    });

    const store = createTestStore();
    const result = await store.dispatch(walletApi.endpoints.createPayment.initiate(paymentData));

    expect(result.error).toBeTruthy();
    expect(result.error.data).toBe("Payment failed");
  });

  test("returns data on success", async () => {
    mockSupabase.auth.getSession.mockResolvedValue({ data: { session: { access_token: "tok" } } });
    global.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ url: "https://checkout.stripe.com/..." }),
    });

    const store = createTestStore();
    const result = await store.dispatch(walletApi.endpoints.createPayment.initiate(paymentData));

    expect(result.data).toEqual({ url: "https://checkout.stripe.com/..." });
  });
});
