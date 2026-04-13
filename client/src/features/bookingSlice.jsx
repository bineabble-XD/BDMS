import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API = import.meta.env.VITE_API_BASE || "http://localhost:5050";

export const createBooking = createAsyncThunk(
  "booking/create",
  async (bookingData, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data.message || "Booking failed");
      }

      return data;
    } catch (err) {
      return rejectWithValue("Network error");
    }
  }
);

const bookingSlice = createSlice({
  name: "booking",
  initialState: {
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    resetBooking: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetBooking } = bookingSlice.actions;
export default bookingSlice.reducer;