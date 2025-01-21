import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {Interview} from '../helper/InterviewList'

type InterviewState = {
  allInterviews: Interview[];
  filtredInterviews: Interview[];
  searchQuery: string;
};


const initialState: InterviewState = {
  allInterviews: [],
  filtredInterviews: [],
  searchQuery: '',
};


const ListSlice = createSlice({
  name: 'interviews',
  initialState,
  reducers: {
    setInterviews: (state, action: PayloadAction<Interview[]>) => {
      state.allInterviews = action.payload;

      if (state.filtredInterviews.length === 0) {
        state.filtredInterviews = action.payload;
      }
    },
    setFiltredInterviews: (state, action: PayloadAction<Interview[]>) => {
      state.filtredInterviews = action.payload;
    },
    filtreByType: (state, action: PayloadAction<"video" | "textual" |"List" >) => {
      const type = action.payload;
      state.filtredInterviews = state.filtredInterviews.filter(
        (interview) =>  interview.type === type
      );
    },
    filtreByStatus: (state, action: PayloadAction<"complete" | "incomplete" | "Status">) => {
      const status = action.payload;
      state.filtredInterviews = state.filtredInterviews.filter(
        (interview) => interview.status === status
      );
    },
    filtreByDifficulty: (state, action: PayloadAction<"easy" | "medium" | "hard" | "DifficultyLevel">) => {
      const difficulty = action.payload;
      state.filtredInterviews = state.filtredInterviews.filter(
        (interview) =>  interview.difficultyLevel === difficulty
      );
    },
    filtreByDuration: (state, action: PayloadAction<"short" | "medium" | "long"  | "Duration">) => {
      const duration = action.payload;
      state.filtredInterviews = state.filtredInterviews.filter(
        (interview) =>  interview.duration === duration
      );
    },
    resetFiltre: (state) => {
      console.log('reset');
      state.searchQuery = '';
      state.filtredInterviews = state.allInterviews;
    },
    searchByJobTitle: (state, action: PayloadAction<string>) => {
      const query = action.payload.toLowerCase();
      console.log('change:', query);
      state.filtredInterviews = state.filtredInterviews.filter((interview) =>
        interview.jobTitle.toLowerCase().includes(query)
      );
    },
    deleteInterview: (state, action: PayloadAction<string>) => {
      const interviewId = action.payload;
      console.log('deleted:', interviewId);
      state.filtredInterviews = state.filtredInterviews.filter(
        (interview) => interview.objectId !== interviewId
      );
    },
  },
});

export const {
  setInterviews,
  setFiltredInterviews,
  filtreByType,
  filtreByStatus,
  filtreByDifficulty,
  filtreByDuration,
  resetFiltre,
  searchByJobTitle,
  deleteInterview,
} = ListSlice.actions;

export default ListSlice.reducer;
