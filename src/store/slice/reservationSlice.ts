import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Hotel } from "../../utils/types/hotelTypes";

interface ReservationState {
  id?: string;
  userId?: string;
  name: string;
  phone: string;
  email: string;
  paymentMethod: string;
  date: any;
  hotel: Hotel;
}

const initialState: ReservationState[] = [];

const reservationSlice = createSlice({
  name: 'reservation',
  initialState,
  reducers: {
    addReservation: (state, action: PayloadAction<ReservationState>) => {
      state.push(action.payload);
    },
    updateReservation: (state, action: PayloadAction<{ index: number, reservation: Partial<ReservationState> }>) => {
      const { index, reservation } = action.payload;
      if (index >= 0 && index < state.length) {
        state[index] = { ...state[index], ...reservation};
      }
    },
    deleteReservation: (state, action: PayloadAction<number>) => {
      const indexToDelete = action.payload;
      if (indexToDelete >= 0 && indexToDelete < state.length) {
        state.splice(indexToDelete, 1);
      }
    },
  },
});

export const { addReservation, updateReservation, deleteReservation } = reservationSlice.actions;
export default reservationSlice.reducer;
