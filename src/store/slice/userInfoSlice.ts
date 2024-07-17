import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  destination: string;
  adults: string;
  children: string;
  date?: any;
};

const initialState: UserState = {
  destination: '',
  adults: '',
  children: '',
  date: [new Date(), new Date(new Date().getTime() + 24 * 60 * 60 * 1000)],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.destination = action.payload.destination;
      state.adults = action.payload.adults;
      state.children = action.payload.children;
      state.date = action.payload.date;
    },
    updateUser: (state, action: PayloadAction<Partial<UserState>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setUser, updateUser } = userSlice.actions;
export default userSlice.reducer;