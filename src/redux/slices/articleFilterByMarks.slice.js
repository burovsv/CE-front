import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: []
}

const articleFilterByMarksSlice = createSlice({
    name: 'articleFilterByMarks',
    initialState,
    reducers: {
        setArticleFilterMarks(state, action) {
            state.value = action.payload;
        }
    }
})

export const { setArticleFilterMarks } = articleFilterByMarksSlice.actions;
export const articleFilterByMarksReducer = articleFilterByMarksSlice.reducer;