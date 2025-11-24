// src/features/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE = 'http://localhost:5050';

// --- REGISTER THUNK ---
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        return rejectWithValue(data.message || 'Registration failed');
      }

      return data.message || 'Registered successfully!';
    } catch (err) {
      return rejectWithValue('Network error, please try again.');
    }
  }
);

// --- LOGIN THUNK ---
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        return rejectWithValue(data.message || 'Login failed');
      }

      // backend returns: { user, message }
      return data;
    } catch (err) {
      return rejectWithValue('Network error, please try again.');
    }
  }
);

const savedUser = JSON.parse(localStorage.getItem('bdmsUser') || 'null');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: savedUser,       // ⬅️ rehydrate from localStorage
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.error = null;
      state.message = null;
      localStorage.removeItem('bdmsUser');  // ⬅️ clear on logout
    },
    clearAuthMessage(state) {
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    // REGISTER
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // LOGIN
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.message = action.payload.message || 'Login success';

        // ⬅️ save logged-in user
        localStorage.setItem('bdmsUser', JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearAuthMessage } = authSlice.actions;
export default authSlice.reducer;
