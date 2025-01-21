import { configureStore } from '@reduxjs/toolkit';
import activePageReducer from '../features/activePageSlice';
import textInterviewReducer from '../features/textInterviewSlice';
import textScoreReducer from '../features/textScoreSlice';
import { apiSlice } from '@/features/apiSlice';
import authReducer from '@/features/authSlice';
import profileReducer from '@/features/profileSlice';
const store = configureStore({
  reducer: {
    quiz: textInterviewReducer,
    activePage: activePageReducer,
    score: textScoreReducer,
    api: apiSlice.reducer,
    auth: authReducer,
    profile: profileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware), // Add RTK Query middleware
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
