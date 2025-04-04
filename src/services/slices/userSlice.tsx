import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '../../utils/types';
import {
  forgotPasswordApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  resetPasswordApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { deleteCookie, setCookie } from '../../utils/cookie';

export const getUserThunk = createAsyncThunk('user/get', getUserApi);

export const registerUserThunk = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response;
  }
);

export const loginUserThunk = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => {
    const response = await loginUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response;
  }
);

export const logoutUserThunk = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

export const updateUserThunk = createAsyncThunk('user/update', updateUserApi);

export const forgotPasswordThunk = createAsyncThunk(
  'user/forgotPassword',
  forgotPasswordApi
);

export const resetPasswordThunk = createAsyncThunk(
  'user/resetPassword',
  resetPasswordApi
);

type TUserState = {
  isAuthChecked: boolean;
  isLoading: boolean;
  user: TUser | null;
  error: string | null;
};

const initialState: TUserState = {
  isAuthChecked: false,
  isLoading: false,
  user: null,
  error: null
};

export const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  selectors: {
    userSelector: (state) => state
  },
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(registerUserThunk.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.error = action.error.message ?? null;
        state.isLoading = false;
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isLoading = false;
        state.isAuthChecked = true;
      })

      .addCase(loginUserThunk.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.error = action.error.message ?? null;
        state.isLoading = false;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthChecked = true;
        state.isLoading = false;
      })

      .addCase(logoutUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUserThunk.rejected, (state, action) => {
        state.error = action.error.message ?? null;
        state.isLoading = false;
      })
      .addCase(logoutUserThunk.fulfilled, (state, action) => {
        state.user = null;
        state.error = null;
        state.isAuthChecked = true;
        state.isLoading = false;
      })

      .addCase(updateUserThunk.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.error = action.error.message ?? null;
        state.isAuthChecked = true;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.error = null;
        state.isLoading = false;
        state.isAuthChecked = true;
        state.user = action.payload.user;
      })

      .addCase(forgotPasswordThunk.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(forgotPasswordThunk.rejected, (state, action) => {
        state.error = action.error.message ?? null;
        state.isLoading = false;
      })
      .addCase(forgotPasswordThunk.fulfilled, (state) => {
        state.error = null;
        state.isLoading = false;
      })

      .addCase(resetPasswordThunk.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(resetPasswordThunk.rejected, (state, action) => {
        state.error = action.error.message ?? null;
        state.isLoading = false;
      })
      .addCase(resetPasswordThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })

      .addCase(getUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? null;
      })
      .addCase(getUserThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthChecked = true;
        state.isLoading = false;
      });
  }
});

export const { userSelector } = userSlice.selectors;
export const { clearUserError } = userSlice.actions;
export default userSlice.reducer;
