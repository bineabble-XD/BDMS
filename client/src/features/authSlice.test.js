import { describe, it, expect, beforeEach, vi } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import authReducer, { loginUser } from "./authSlice";

describe("Auth login (Redux thunk)", () => {
  beforeEach(() => {
    vi.mocked(global.fetch).mockReset();
    vi.mocked(window.localStorage.setItem).mockClear();
  });

  it("persists user to state and localStorage when /login succeeds", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        user: { _id: "usr1", email: "donor@example.com", isHospital: false },
        message: "Success",
      }),
    });

    const store = configureStore({ reducer: { auth: authReducer } });
    await store.dispatch(
      loginUser({ email: "donor@example.com", password: "Password1!" })
    );

    expect(store.getState().auth.error).toBe(null);
    expect(store.getState().auth.user?.email).toBe("donor@example.com");
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      "bdmsUser",
      expect.stringContaining("donor@example.com")
    );
  });
});
