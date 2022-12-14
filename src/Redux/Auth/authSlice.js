import { createSlice } from '@reduxjs/toolkit';
import operations from './auth.service';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

export const authSlice = createSlice({
  name: 'auth',

  initialState: {
    // user: {
    //   email: null,
    //   username: null,
    //   id: null,
    //   userData: {
    //     notAllowedProducts: [],
    //     weight: 0,
    //     height: 0,
    //     age: 0,
    //     bloodType: 0,
    //     desiredWeight: 0,
    //     dailyRate: 0,
    //   },
    // },
    todaySummary: {},
    accessToken: null,
    refreshToken: null,
    sid: null,
    isLoggedIn: false,
    isLoading: true,
    isCompletedRefreshing: false,
    avatar: null,
    date: new Date(),
    colorTheme: false,
  },
  reducers: {
    addAvatar(state, action) {
      state.avatar = action.payload;
    },
    getDate(state, action) {
      state.date = action.payload;
    },
    changeTheme(state, action) {
      state.colorTheme = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(operations.register.fulfilled, (state, { payload }) => {
      state.user.userData = payload;
    });
    builder.addCase(operations.logIn.fulfilled, (state, { payload }) => {
      state.user = payload.user;
      state.todaySummary = payload.todaySummary;
      state.accessToken = payload.accessToken;
      state.refreshToken = payload.refreshToken;
      state.sid = payload.sid;
      state.isLoggedIn = true;
    });
    builder.addCase(operations.logOut.fulfilled, state => {
      // state.user = {
      //   email: null,
      //   username: null,
      //   id: null,
      //   userData: {
      //     notAllowedProducts: [],
      //     weight: 0,
      //     height: 0,
      //     age: 0,
      //     bloodType: 0,
      //     desiredWeight: 0,
      //     dailyRate: 0,
      //   },
      // };
      state.accessToken = null;
      state.refreshToken = null;
      state.sid = null;
      state.isLoggedIn = false;
    });
    builder
      .addCase(operations.fetchCurrentUser.pending, state => {
        // state.isLoading = true;
        state.isCompletedRefreshing = false;
      })
      .addCase(operations.fetchCurrentUser.fulfilled, (state, { payload }) => {
        state.accessToken = payload.newAccessToken;
        state.refreshToken = payload.newRefreshToken;
        state.sid = payload.sid;
        state.isLoggedIn = true;
        state.isLoading = false;
        state.isCompletedRefreshing = true;
      });
  },
});

export const { addAvatar, getDate, changeTheme } = authSlice.actions;

const persistConfig = {
  key: 'auth',
  storage,
  whitelist: ['sid', 'accessToken', 'refreshToken', 'avatar', 'colorTheme'],
};

export const persistedReducer = persistReducer(
  persistConfig,
  authSlice.reducer
);
