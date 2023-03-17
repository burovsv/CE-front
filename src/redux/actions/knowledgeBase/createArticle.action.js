import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateCreateArticle = {
    createArticle: { data: null, loading: false, error: null },
};

export const createArticle = createAsyncThunk('/article/create', async (data, { rejectWithValue, fulfillWithValue }) => {
    return await axios
        .post(`${process.env.REACT_APP_SERVER_API}/article/create`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then((res) => {
            return fulfillWithValue(res.data);
        })
        .catch((res) => {
            return rejectWithValue(res.response.data);
        });
});

export const reducerCreateArticle = {
    [createArticle.pending]: (state) => {
        state.createArticle.loading = true;
        state.createArticle.success = false;
    },
    [createArticle.fulfilled]: (state, action) => {
        state.createArticle.loading = false;
        state.createArticle.data = action.payload;
        state.createArticle.error = null;
        state.createArticle.success = true;
    },
    [createArticle.rejected]: (state, action) => {
        state.createArticle.loading = false;
        state.createArticle.error = action.payload;
        state.createArticle.success = false;
    }
};