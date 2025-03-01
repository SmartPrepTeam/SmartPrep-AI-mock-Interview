import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { videoScoreData } from '@/types/scoreTypes';

interface videoScoreState {
  data: videoScoreData | null;
}

const initialState: videoScoreState = {
  data: null,
};

const videoScoreSlice = createSlice({
  name: 'video interview scores ',
  initialState,
  reducers: {
    setVideoScoreData(state, action: PayloadAction<videoScoreState['data']>) {
      state.data = action.payload;
    },
  },
});

export const { setVideoScoreData } = videoScoreSlice.actions;
export default videoScoreSlice.reducer;
