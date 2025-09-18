import { createSlice } from "@reduxjs/toolkit";

const stationSlice = createSlice({
  name: "station",
  initialState: { stationStatus: false },
  reducers: {
    stationStatusSet: (state, action) => {
      state.stationStatus = action.payload;
    },
  },
});

export const { stationStatusSet } = stationSlice.actions;
export default stationSlice.reducer;
