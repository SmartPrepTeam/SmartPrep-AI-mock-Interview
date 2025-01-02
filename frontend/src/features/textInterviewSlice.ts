import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Question } from '@/types/questionTypes';

interface textInterviewState {
  questions: Question[];
  interviewId: string | null;
}

const initialState: textInterviewState = {
  questions: [],
  interviewId: null,
};
export const textInterviewSlice = createSlice({
  name: 'Textual Interview Questions',
  initialState,
  reducers: {
    setTextInterviewData(
      state,
      action: PayloadAction<{ questions: Question[]; interviewId: string }>
    ) {
      state.questions = action.payload.questions;
      state.interviewId = action.payload.interviewId;
    },
  },
});
export const { setTextInterviewData } = textInterviewSlice.actions;
export default textInterviewSlice.reducer;
