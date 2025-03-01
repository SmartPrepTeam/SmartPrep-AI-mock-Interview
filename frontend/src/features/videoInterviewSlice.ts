import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Question } from '@/types/questionTypes';

interface videoInterviewState {
  questions: Question[];
  interviewId: string | null;
}

const initialState: videoInterviewState = {
  questions: [],
  interviewId: null,
};
export const videoInterviewSlice = createSlice({
  name: 'Video Interview Questions',
  initialState,
  reducers: {
    setVideoInterviewData(
      state,
      action: PayloadAction<{ questions: Question[]; interviewId: string }>
    ) {
      state.questions = action.payload.questions;
      state.interviewId = action.payload.interviewId;
    },
  },
});
export const { setVideoInterviewData } = videoInterviewSlice.actions;
export default videoInterviewSlice.reducer;
