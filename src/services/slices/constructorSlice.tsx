import { orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice, nanoid } from '@reduxjs/toolkit';
import { TConstructorIngredient, TOrder } from '@utils-types';

export const createOrderThunk = createAsyncThunk(
  'constructorbg/post',
  (data: string[]) => orderBurgerApi(data)
);

type TConstructorState = {
  isLoading: boolean;
  items: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
};

const initialState: TConstructorState = {
  isLoading: false,
  items: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null,
  error: null
};

export const constructorSlice = createSlice({
  name: 'constructorbg',
  initialState: initialState,
  selectors: {
    constructorSelector: (state) => state
  },
  reducers: {
    addIngredient: (state, action) => {
      if (action.payload.type === 'bun') {
        state.items.bun = action.payload;
      } else {
        state.items.ingredients.push({
          ...action.payload,
          id: nanoid()
        });
      }
    },
    deleteIngredient: (state, action) => {
      state.items.ingredients = state.items.ingredients.filter(
        (ingredient) => ingredient._id != action.payload
      );
    },
    toggleOrderRequest: (state, action) => {
      state.orderRequest = action.payload;
    },
    clearOrderModalData: (state) => {
      state.orderModalData = null;
    },
    moveUpIngredient: (state, action) => {
      const index = action.payload;
      if (index <= 0) return;

      state.items.ingredients = state.items.ingredients.map((item, i) => {
        if (i === index - 1) return state.items.ingredients[index];
        if (i === index) return state.items.ingredients[index - 1];
        return item;
      });
    },
    moveDownIngredient: (state, action) => {
      const index = action.payload;
      if (index < 0 || index >= state.items.ingredients.length - 1) return;

      state.items.ingredients = state.items.ingredients.map((item, i) => {
        if (i === index) return state.items.ingredients[index + 1];
        if (i === index + 1) return state.items.ingredients[index];
        return item;
      });
    }
  },
  extraReducers(builder) {
    builder
      .addCase(createOrderThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.orderRequest = true;
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.orderRequest = false;
        state.error = action.error.message ?? null;
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
        state.items = {
          bun: null,
          ingredients: []
        };
      });
  }
});

export const {
  moveDownIngredient,
  moveUpIngredient,
  clearOrderModalData,
  toggleOrderRequest,
  deleteIngredient,
  addIngredient
} = constructorSlice.actions;

export const { constructorSelector } = constructorSlice.selectors;

export default constructorSlice.reducer;
