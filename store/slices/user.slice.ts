import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  loggedInUser: {
    token?: string;
    user?: any;
    device?: any;
    expiresAt?: string;
  } | null;
}

const initialState: UserState = {
  loggedInUser: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoggedInUser: (state, action: PayloadAction<any>) => {
      state.loggedInUser = action.payload;
    },
    clearLoggedInUser: (state) => {
      state.loggedInUser = null;
    },
  },
});

export const { setLoggedInUser, clearLoggedInUser } = userSlice.actions;
export default userSlice.reducer;
