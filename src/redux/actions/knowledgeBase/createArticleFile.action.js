import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateCreateArticleFile = {
    createArticleFile: { data: null, loading: false, error: null },
};

export const createArticleFile = createAsyncThunk('/article/file/create', async (data, { rejectWithValue, fulfillWithValue }) => {
    return await axios
        .post(`${process.env.REACT_APP_SERVER_API}/article/file/create`, data)
        .then((res) => {
            return fulfillWithValue(res.data);
        })
        .catch((res) => {
            return rejectWithValue(res.response.data);
        });
});

export const reducerCreateArticleFile = {
    [createArticleFile.pending]: (state) => {
        state.createArticleFile.loading = true;
    },
    [createArticleFile.fulfilled]: (state, action) => {
        state.createArticleFile.loading = false;
        state.createArticleFile.data = action.payload;
        state.createArticleFile.error = null;
    },
    [createArticleFile.rejected]: (state, action) => {
        state.createArticleFile.loading = false;
        state.createArticleFile.error = action.payload;
    }
};