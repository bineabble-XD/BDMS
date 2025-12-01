import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import hospitalReducer from '../features/hospitalSlice';  // <-- add this

const store = configureStore({
  reducer: {
    auth: authReducer,
    hospital: hospitalReducer,  // <-- register it here
  },
});

export default store;
