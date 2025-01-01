import { createSlice } from '@reduxjs/toolkit';

export const activePageSlice = createSlice({
  name: 'ActivePage in interviews',

  initialState: {
    value: 'intro',
  },

  reducers: {
    activePage: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { activePage } = activePageSlice.actions;

export default activePageSlice.reducer;
