import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { textScoreData } from '@/types/scoreTypes';

interface textScoreState {
  data: textScoreData | null;
}

const initialState: textScoreState = {
  data: null,
};

const textScoreSlice = createSlice({
  name: 'textual interview scores ',
  initialState,
  reducers: {
    setTextScoreData(state, action: PayloadAction<textScoreState['data']>) {
      state.data = action.payload;
    },
  },
});

export const { setTextScoreData } = textScoreSlice.actions;
export default textScoreSlice.reducer;
