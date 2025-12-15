import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";

import Login from "./Login.jsx";
import * as authSlice from "../features/authSlice";
import authReducer, { loginUser } from "../features/authSlice";

// ✅ mock images
vi.mock("../assets/1+.png", () => ({ default: "donor.png" }));
vi.mock("../assets/bdmslogo.png", () => ({ default: "logo.png" }));

// ✅ mock navigation
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

beforeEach(() => {
  mockNavigate.mockClear();
  vi.restoreAllMocks();
  vi.spyOn(window, "alert").mockImplementation(() => {});
});

function renderLogin({
  authPreloaded = { user: null, loading: false, error: null, message: null },
} = {}) {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: { auth: authPreloaded },
  });

  const utils = render(
    <Provider store={store}>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </Provider>
  );

  // disable native validation
  const form = utils.container.querySelector("form");
  if (form) form.setAttribute("novalidate", "true");

  return { store, form, ...utils };
}

const fillEmail = (value) =>
  fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
    target: { value },
  });

const fillPassword = (value) =>
  fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
    target: { value },
  });

const submitForm = (form) => fireEvent.submit(form);

describe("BDMS Login", () => {
  it("navigates to /inventory for inventory hardcoded account (no dispatch)", () => {
    const { store, form } = renderLogin();
    const dispatchSpy = vi.spyOn(store, "dispatch");

    fillEmail("inventory@bdms.com");
    fillPassword("Blood@123");
    submitForm(form);

    expect(mockNavigate).toHaveBeenCalledWith("/inventory");

    const dispatchedTypes = dispatchSpy.mock.calls.map((c) => c[0]?.type);
    expect(dispatchedTypes).not.toContain(loginUser.pending.type);
  });

  it("alerts if email is empty", () => {
    const { form } = renderLogin();

    fillEmail("");
    fillPassword("Password123!");
    submitForm(form);

    expect(window.alert).toHaveBeenCalledWith(
      "Please enter your email address."
    );
  });

  it("alerts if email is invalid format", () => {
    const { form } = renderLogin();

    fillEmail("notanemail");
    fillPassword("Password123!");
    submitForm(form);

    expect(window.alert).toHaveBeenCalledWith(
      "Please enter a valid email address."
    );
  });

  it("alerts if password is empty", () => {
    const { form } = renderLogin();

    fillEmail("user@example.com");
    fillPassword("");
    submitForm(form);

    expect(window.alert).toHaveBeenCalledWith(
      "Please enter your password."
    );
  });

  it("alerts if password < 8 chars", () => {
    const { form } = renderLogin();

    fillEmail("user@example.com");
    fillPassword("123");
    submitForm(form);

    expect(window.alert).toHaveBeenCalledWith(
      "Password must be at least 8 characters."
    );
  });

  it("dispatches loginUser with trimmed email", () => {
    const { store, form } = renderLogin();

    const loginSpy = vi
      .spyOn(authSlice, "loginUser")
      .mockReturnValue({ type: "auth/loginUser" });

    const dispatchSpy = vi.spyOn(store, "dispatch");

    fillEmail("   user@example.com   ");
    fillPassword("Password123!");
    submitForm(form);

    expect(loginSpy).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "Password123!",
    });

    expect(dispatchSpy).toHaveBeenCalledWith({ type: "auth/loginUser" });
  });

  it("alerts when user is not verified and does NOT navigate", () => {
    renderLogin({
      authPreloaded: {
        loading: false,
        error: null,
        message: null,
        user: { isVerified: false, isAdmin: false, isHospital: false },
      },
    });

    expect(window.alert).toHaveBeenCalledWith(
      "Please verify your email before logging in."
    );
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("navigates to /reports when admin user is logged in", () => {
    renderLogin({
      authPreloaded: {
        loading: false,
        error: null,
        message: null,
        user: { isVerified: true, isAdmin: true, isHospital: false },
      },
    });

    expect(mockNavigate).toHaveBeenCalledWith("/reports");
  });

  it("navigates to /hospital-dash when hospital user is logged in", () => {
    renderLogin({
      authPreloaded: {
        loading: false,
        error: null,
        message: null,
        user: { isVerified: true, isAdmin: false, isHospital: true },
      },
    });

    expect(mockNavigate).toHaveBeenCalledWith("/hospital-dash");
  });

  it("navigates to /home when normal verified user logs in", () => {
    renderLogin({
      authPreloaded: {
        loading: false,
        error: null,
        message: null,
        user: { isVerified: true, isAdmin: false, isHospital: false },
      },
    });

    expect(mockNavigate).toHaveBeenCalledWith("/home");
  });
});
