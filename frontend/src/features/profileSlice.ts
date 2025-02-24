import { createSlice } from '@reduxjs/toolkit';

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    name: 'Not found',
    img: './mockup.png',
  },
  reducers: {
    setProfileImg: (state, action) => {
      state.img = action.payload;
    },
    setProfileUserName: (state, action) => {
      state.name = action.payload;
    },
  },
});
export const { setProfileImg, setProfileUserName } = profileSlice.actions;
export default profileSlice.reducer;
