import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const registerHospital = createAsyncThunk(
  "hospital/registerHospital",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await fetch("http://localhost:5050/register-hospital", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message);

      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const hospitalSlice = createSlice({
  name: "hospital",
  initialState: {
    loading: false,
    error: null,
    success: false,
    hospital: null,
  },
  reducers: {
    resetHospitalState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.hospital = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerHospital.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerHospital.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.hospital = action.payload;
      })
      .addCase(registerHospital.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetHospitalState } = hospitalSlice.actions;
export default hospitalSlice.reducer;
