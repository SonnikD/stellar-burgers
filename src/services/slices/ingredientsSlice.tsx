import { getIngredientsApi } from '@api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

export const ingredientsThunk = createAsyncThunk(
  'ingredients/get',
  getIngredientsApi
);

type TIngredientsState = {
  isLoading: boolean;
  ingredients: TIngredient[];
  error: string | null;
};

const initialState: TIngredientsState = {
  isLoading: false,
  ingredients: [],
  error: null
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState: initialState,
  selectors: {
    ingredientsSelector: (state) => state
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(ingredientsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(ingredientsThunk.rejected, (state, action) => {
        state.error = action.error.message ?? null;
      })
      .addCase(ingredientsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      });
  }
});

export const { ingredientsSelector } = ingredientsSlice.selectors;

export default ingredientsSlice.reducer;
