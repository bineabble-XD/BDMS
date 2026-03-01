import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// ✅ global fetch mock (used by authSlice)
global.fetch = vi.fn();

// ✅ silence window.alert by default (you can still spy per test)
vi.spyOn(window, "alert").mockImplementation(() => {});

// ✅ mock localStorage (authSlice uses it)
Object.defineProperty(window, "localStorage", {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
});
