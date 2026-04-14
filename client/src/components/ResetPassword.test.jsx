import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import ResetPassword from "./ResetPassword.jsx";
import { LanguageProvider } from "../context/LanguageContext";

vi.mock("../assets/9+.png", () => ({ default: "donor.png" }));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

beforeEach(() => {
  mockNavigate.mockClear();
  global.fetch = vi.fn();
});

function renderResetPassword(token = "test-reset-token") {
  const utils = render(
    <LanguageProvider>
      <MemoryRouter initialEntries={[`/reset-password/${token}`]}>
        <Routes>
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </MemoryRouter>
    </LanguageProvider>
  );

  const form = utils.container.querySelector("form");
  if (form) form.setAttribute("novalidate", "true");

  return { form, ...utils };
}

function fillPasswordFields(container, newPassword, confirmPassword) {
  const [pwd, confirm] = container.querySelectorAll(
    'form input[type="password"]'
  );
  fireEvent.change(pwd, { target: { value: newPassword } });
  fireEvent.change(confirm, { target: { value: confirmPassword } });
}

describe("ResetPassword", () => {
  it("shows mismatch message when passwords differ", () => {
    const { container, form } = renderResetPassword();

    fillPasswordFields(container, "Password1!", "Password2!");
    fireEvent.submit(form);

    expect(
      screen.getByText("Passwords do not match.")
    ).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("shows criteria message when password rules are not met", () => {
    const { container, form } = renderResetPassword();

    fillPasswordFields(container, "short", "short");
    fireEvent.submit(form);

    expect(
      screen.getByText("Password does not meet the required criteria.")
    ).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("posts new password and navigates to login after success", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        message: "Password reset successful. Redirecting...",
      }),
    });

    const { container, form } = renderResetPassword("abc-123");

    fillPasswordFields(container, "Password1!", "Password1!");
    fireEvent.submit(form);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:5050/reset-password/abc-123",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: "Password1!" }),
        })
      );
    });

    await waitFor(() => {
      expect(
        screen.getByText("Password reset successful. Redirecting...")
      ).toBeInTheDocument();
    });

    await waitFor(
      () => {
        expect(mockNavigate).toHaveBeenCalledWith("/login");
      },
      { timeout: 3000 }
    );
  });

  it("shows server message when reset fails", async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      json: async () => ({ message: "Token expired" }),
    });

    const { container, form } = renderResetPassword();

    fillPasswordFields(container, "Password1!", "Password1!");
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText("Token expired")).toBeInTheDocument();
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("shows network error when fetch throws", async () => {
    global.fetch.mockRejectedValue(new Error("offline"));

    const { container, form } = renderResetPassword();

    fillPasswordFields(container, "Password1!", "Password1!");
    fireEvent.submit(form);

    await waitFor(() => {
      expect(
        screen.getByText("Network error. Please try again.")
      ).toBeInTheDocument();
    });
  });
});
