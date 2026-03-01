import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import hospitalReducer from '../features/hospitalSlice';  // <-- add this
import bookingReducer from "../features/bookingSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    hospital: hospitalReducer,  // <-- register it here
    booking: bookingReducer,

  },
});

export default store;
