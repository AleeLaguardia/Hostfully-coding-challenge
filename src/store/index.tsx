import { configureStore } from "@reduxjs/toolkit";
import userReducer from './slice/userInfoSlice';
import reservationReducer from "./slice/reservationSlice";
import authReducer from "./slice/authSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    reservation: reservationReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;