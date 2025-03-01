import { PayloadAction, createSlice } from '@reduxjs/toolkit';

// Define the state structure
interface InterviewType {
  text: string;
  video: string;
}
const initialState: InterviewType = {
  text: 'intro',
  video: 'intro',
};
export const activePageSlice = createSlice({
  name: 'ActivePage in interviews',

  initialState,
  reducers: {
    activePage: (
      state,
      action: PayloadAction<{
        interviewType: keyof InterviewType;
        page: string;
      }>
    ) => {
      state[action.payload.interviewType] = action.payload.page;
    },
    resetActivePage: () => initialState,
  },
});

export const { activePage, resetActivePage } = activePageSlice.actions;

export default activePageSlice.reducer;
