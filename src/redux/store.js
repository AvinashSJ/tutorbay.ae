// store.js
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from '@reduxjs/toolkit/query';
import { apiSlice } from "./services/apiSlice";
import { userSlice } from "./services/userSlice";
import { parentSlice } from "./services/parentSlice";
// import { userApi } from './services/userSlice';
import { walletApi } from './services/walletSlice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [userSlice.reducerPath]: userSlice.reducer,
    [parentSlice.reducerPath]: parentSlice.reducer,
    [walletApi.reducerPath]: walletApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      apiSlice.middleware,
      userSlice.middleware,
      parentSlice.middleware,
      // userApi.middleware,
      walletApi.middleware
    ),
});

setupListeners(store.dispatch);
