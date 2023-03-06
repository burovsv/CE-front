import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateCreateArticlePost = {
    createArticlePost: { data: null, loading: false, error: null },
};

export const createArticlePost = createAsyncThunk('/articlepost/create', async (data, { rejectWithValue, fulfillWithValue }) => {
    return await axios
        .post(`${process.env.REACT_APP_SERVER_API}/articlepost/create`, data)
        .then((res) => {
            return fulfillWithValue(res.data);
        })
        .catch((res) => {
            return rejectWithValue(res.response.data);
        });
});

export const reducerCreateArticlePost = {
    [createArticlePost.pending]: (state) => {
        state.createArticlePost.loading = true;
    },
    [createArticlePost.fulfilled]: (state, action) => {
        state.createArticlePost.loading = false;
        state.createArticlePost.data = action.payload;
        state.createArticlePost.error = null;
    },
    [createArticlePost.rejected]: (state, action) => {
        state.createArticlePost.loading = false;
        state.createArticlePost.error = action.payload;
    }
};