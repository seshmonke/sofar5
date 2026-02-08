import { createSlice } from '@reduxjs/toolkit';
import type { ProductCategory } from '../types/categories';

interface CategoryState {
  selectedCategory: ProductCategory;
}

const initialState: CategoryState = {
  selectedCategory: 'all'
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setCategory: (state, action: { payload: ProductCategory }) => {
      state.selectedCategory = action.payload;
    }
  }
});

export const { setCategory } = categorySlice.actions;
export const categoryReducer = categorySlice.reducer;