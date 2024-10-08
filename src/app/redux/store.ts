"use client";

import { configureStore } from '@reduxjs/toolkit';
import appReducer from '@/app/redux/appSlice';
import authReducer from '@/app/redux/auth/authSlice';

const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
    
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

