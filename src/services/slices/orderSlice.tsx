import { getOrderByNumberApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export const orderThunk = createAsyncThunk('order/get', getOrderByNumberApi);

type orderState = {
  isLoading: boolean;
  order: TOrder | null;
  error: string | null;
};

const initialState: orderState = {
  isLoading: false,
  order: null,
  error: null
};

export const orderSlice = createSlice({
  name: 'order',
  initialState: initialState,
  selectors: {
    orderSelector: (state) => state
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(orderThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(orderThunk.rejected, (state, action) => {
        state.error = action.error.message ?? null;
      })
      .addCase(orderThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload.orders[0];
      });
  }
});

export const { orderSelector } = orderSlice.selectors;
export default orderSlice.reducer;
