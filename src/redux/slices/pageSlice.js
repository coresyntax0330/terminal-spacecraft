import { createSlice } from "@reduxjs/toolkit";

const pageSlice = createSlice({
  name: "page",
  initialState: { path: "" },
  reducers: {
    pageSet: (state, action) => {
      state.path = action.payload;
    },
  },
});

export const { pageSet } = pageSlice.actions;
export default pageSlice.reducer;
