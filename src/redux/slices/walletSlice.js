import { createSlice } from "@reduxjs/toolkit";

const walletSlice = createSlice({
  name: "wallet",
  initialState: { status: false },
  reducers: {
    walletStatusSet: (state, action) => {
      state.status = action.payload;
    },
  },
});

export const { walletStatusSet } = walletSlice.actions;
export default walletSlice.reducer;
