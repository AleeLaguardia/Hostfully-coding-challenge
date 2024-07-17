import { configureStore } from "@reduxjs/toolkit";
import userReducer from './slice/userInfoSlice';
import reservationReducer from "./slice/reservationSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    reservation: reservationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;