import { configureStore } from '@reduxjs/toolkit';
import activePageReducer from '../features/activePageSlice';
import textInterviewReducer from '../features/textInterviewSlice';
import videoInterviewReducer from '../features/videoInterviewSlice';
import textScoreReducer from '../features/textScoreSlice';
import videoScoreReducer from '../features/videoScoreSlice';
import { apiSlice } from '@/features/apiSlice';
import authReducer from '@/features/authSlice';
import profileReducer from '@/features/profileSlice';
import interviewReducer from '../features/ListSlice';
import HistoryInsightsReducer from '../features/InsightsSlice';
const store = configureStore({
  reducer: {
    quiz: textInterviewReducer,
    videoInterview: videoInterviewReducer,
    activePage: activePageReducer,
    score: textScoreReducer,
    videoScore: videoScoreReducer,
    api: apiSlice.reducer,
    auth: authReducer,
    profile: profileReducer,
    interviews: interviewReducer,
    historyInsights: HistoryInsightsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware), // Add RTK Query middleware
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
