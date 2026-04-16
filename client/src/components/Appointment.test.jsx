import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, waitFor, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import Appointment from "./Appointment.jsx";
import authReducer from "../features/authSlice";
import bookingReducer from "../features/bookingSlice";
import * as bookingSlice from "../features/bookingSlice";
import { LanguageProvider } from "../context/LanguageContext";

vi.mock("../assets/11+.png", () => ({ default: "donor.png" }));
vi.mock("../utils/omanTime", () => ({
  getTodayInOman: () => "2099-01-01",
  getMaxDateInOman: () => "2099-01-15",
  getCurrentMinutesInOman: () => 0,
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

beforeEach(() => {
  mockNavigate.mockClear();
  vi.restoreAllMocks();
  vi.spyOn(window, "alert").mockImplementation(() => {});

  global.fetch = vi.fn((url) => {
    if (url.includes("/hospitals/approved")) {
      return Promise.resolve({
        ok: true,
        json: async () => [
          { _id: "h1", hospitalName: "City Hospital", city: "Muscat" },
        ],
      });
    }

    if (url.includes("/api/bookings/slots")) {
      return Promise.resolve({
        ok: true,
        json: async () => ({ bookedSlots: [] }),
      });
    }

    return Promise.resolve({
      ok: false,
      json: async () => ({}),
    });
  });
});

function renderAppointment() {
  const store = configureStore({
    reducer: { auth: authReducer, booking: bookingReducer },
    preloadedState: {
      auth: {
        user: { _id: "u1", bloodType: "A+" },
        loading: false,
        error: null,
        message: null,
      },
      booking: { loading: false, success: false, error: null },
    },
  });

  const utils = render(
    <Provider store={store}>
      <LanguageProvider>
        <MemoryRouter initialEntries={["/appointments"]}>
          <Routes>
            <Route path="/appointments" element={<Appointment />} />
          </Routes>
        </MemoryRouter>
      </LanguageProvider>
    </Provider>
  );

  const form = utils.container.querySelector("form");
  if (form) form.setAttribute("novalidate", "true");

  return { store, form, ...utils };
}

describe("Appointment booking", () => {
  it("dispatches createBooking with form values when appointment is valid", async () => {
    const createBookingSpy = vi
      .spyOn(bookingSlice, "createBooking")
      .mockReturnValue({ type: "booking/create" });

    const { container, store, form } = renderAppointment();
    const dispatchSpy = vi.spyOn(store, "dispatch");

    await waitFor(() => {
      const hospitalSelect = container.querySelector('select[name="hospital"]');
      expect(hospitalSelect?.value).toBe("h1");
    });

    ["sick10", "donated8w", "antibiotics", "surgery"].forEach((id) => {
      fireEvent.click(container.querySelector(`input[name="${id}"][value="no"]`));
    });

    fireEvent.change(container.querySelector('input[name="appointmentDate"]'), {
      target: { value: "2099-01-02" },
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/bookings/slots?hospitalId=h1&date=2099-01-02")
      );
    });

    fireEvent.change(container.querySelector('select[name="appointmentTime"]'), {
      target: { value: "09:15" },
    });
    fireEvent.click(container.querySelector('input[name="confirmHealth"]'));
    fireEvent.submit(form);

    expect(createBookingSpy).toHaveBeenCalledTimes(1);

    const payload = createBookingSpy.mock.calls[0][0];
    expect(payload.donorId).toBe("u1");
    expect(payload.hospitalId).toBe("h1");
    expect(payload.bloodType).toBe("A+");
    expect(payload.eligibility.screening).toMatchObject({
      sick10: "no",
      donated8w: "no",
      antibiotics: "no",
      surgery: "no",
    });
    expect(payload.appointmentDate).toBeInstanceOf(Date);
    expect(payload.appointmentDate.toISOString()).toBe("2099-01-02T05:15:00.000Z");

    expect(dispatchSpy).toHaveBeenCalledWith({ type: "booking/create" });
  });
});
