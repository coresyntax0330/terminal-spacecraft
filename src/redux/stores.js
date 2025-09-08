import { configureStore } from "@reduxjs/toolkit";
import pageReducer from "./slices/pageSlice";
import walletReducer from "./slices/walletSlice";

export const store = configureStore({
  reducer: {
    page: pageReducer,
    wallet: walletReducer,
  },
});
