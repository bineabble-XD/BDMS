import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import hospitalReducer from '../features/hospitalSlice';
import bookingReducer from "../features/bookingSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    hospital: hospitalReducer,
    booking: bookingReducer,
  },
});

export default store;
