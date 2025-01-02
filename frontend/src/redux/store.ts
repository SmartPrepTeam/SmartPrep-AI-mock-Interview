import { configureStore } from '@reduxjs/toolkit';
import activePageReducer from '../features/activePageSlice';
import textInterviewReducer from '../features/textInterviewSlice';
import textScoreReducer from '../features/textScoreSlice';

const store = configureStore({
  reducer: {
    quiz: textInterviewReducer,
    activePage: activePageReducer,
    score: textScoreReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
