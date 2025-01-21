import { createSlice } from '@reduxjs/toolkit';

const token = sessionStorage.getItem('access_token');
const userId = sessionStorage.getItem('user_id');
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: token,
    userId: userId,
  },
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload;
      if (state.userId) {
        sessionStorage.setItem('user_id', state.userId);
      } else {
        sessionStorage.removeItem('user_id');
      }
    },
    setToken: (state, action) => {
      state.token = action.payload;
      if (state.token) {
        sessionStorage.setItem('access_token', state.token);
        console.log("access token : ",state.token
          
        )
      } else {
        sessionStorage.removeItem('access_token');
      }
    },
    logout: (state) => {
      state.userId = null;
      state.token = null;
      sessionStorage.removeItem('user_id');
      sessionStorage.removeItem('access_token');
    },
  },
});
export const { setUserId, setToken, logout } = authSlice.actions;
export default authSlice.reducer;
