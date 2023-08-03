import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: "",
}

const articleSearchSlice = createSlice({
    name: 'articleSearch',
    initialState,
    reducers: {
        setArticleSearch(state, action) {
            state.value = action.payload;
        }
    }
})

export const { setArticleSearch } = articleSearchSlice.actions;
export const articleSearchReducer = articleSearchSlice.reducer;