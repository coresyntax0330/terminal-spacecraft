import { configureStore } from "@reduxjs/toolkit";
import pageReducer from "./slices/pageSlice";
import walletReducer from "./slices/walletSlice";
import stationReducer from "./slices/stationSlice";

export const store = configureStore({
  reducer: {
    page: pageReducer,
    wallet: walletReducer,
    station: stationReducer,
  },
});
