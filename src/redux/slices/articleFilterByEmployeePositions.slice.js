import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: []
}

const articleFilterByEmployeePositionsSlice = createSlice({
    name: 'articleFilterByEmployeePositions',
    initialState,
    reducers: {
        setArticleFilterEmployeePositions(state, action) {
            state.value = action.payload;
        }
    }
})

export const { setArticleFilterEmployeePositions } = articleFilterByEmployeePositionsSlice.actions;
export const articleFilterByEmployeePositionsReducer = articleFilterByEmployeePositionsSlice.reducer;