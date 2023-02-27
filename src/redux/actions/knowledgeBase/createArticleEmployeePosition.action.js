import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateCreateArticleEmployeePosition = {
    createArticleEmployeePosition: { data: null, loading: false, error: null },
};

export const createArticleEmployeePosition = createAsyncThunk('/articlemployeeposition/create', async (data, { rejectWithValue, fulfillWithValue }) => {
    return await axios
        .post(`${process.env.REACT_APP_SERVER_API}/articlemployeeposition/create`, data)
        .then((res) => {
            return fulfillWithValue(res.data);
        })
        .catch((res) => {
            return rejectWithValue(res.response.data);
        });
});

export const reducerCreateArticleEmployeePosition = {
    [createArticleEmployeePosition.pending]: (state) => {
        state.createArticleEmployeePosition.loading = true;
    },
    [createArticleEmployeePosition.fulfilled]: (state, action) => {
        state.createArticleEmployeePosition.loading = false;
        state.createArticleEmployeePosition.data = action.payload;
        state.createArticleEmployeePosition.error = null;
    },
    [createArticleEmployeePosition.rejected]: (state, action) => {
        state.createArticleEmployeePosition.loading = false;
        state.createArticleEmployeePosition.error = action.payload;
    }
};