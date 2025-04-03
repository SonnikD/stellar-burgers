import { getFeedsApi, getOrdersApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export const feedThunk = createAsyncThunk('feed/getFeed', getFeedsApi);
export const profileOrderThunk = createAsyncThunk(
  'feed/getOrders',
  getOrdersApi
);

type TFeedState = {
  isLoading: boolean;
  orders: TOrder[];
  total: number;
  totalToday: number;
  error: string | null;
};

const initialState: TFeedState = {
  isLoading: false,
  orders: [],
  total: 0,
  totalToday: 0,
  error: null
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState: initialState,
  selectors: {
    feedSelector: (state) => state
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(feedThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(feedThunk.rejected, (state, action) => {
        state.error = action.error.message ?? null;
      })
      .addCase(feedThunk.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.isLoading = false;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.error = null;
      })
      .addCase(profileOrderThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(profileOrderThunk.rejected, (state, action) => {
        state.error = action.error.message ?? null;
        state.isLoading = false;
      })
      .addCase(profileOrderThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      });
  }
});
export const { feedSelector } = feedSlice.selectors;

export default feedSlice.reducer;
