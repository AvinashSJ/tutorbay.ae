// store.js
import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./services/apiSlice";
import { userSlice } from "./services/userSlice";
import { parentSlice } from "./services/parentSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [userSlice.reducerPath]: userSlice.reducer,
    [parentSlice.reducerPath]: userSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      apiSlice.middleware,
      userSlice.middleware,
      parentSlice.middleware
    ),
});
