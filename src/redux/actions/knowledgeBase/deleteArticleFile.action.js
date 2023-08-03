import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateDeleteArticleFile = {
    deleteArticleFile: { data: null, loading: false, error: null },
};

export const deleteArticleFile = createAsyncThunk('/article/file/delete', async (data, { rejectWithValue, fulfillWithValue }) => {
    return await axios
        .post(`${process.env.REACT_APP_SERVER_API}/article/file/delete`, data)
        .then((res) => {
            return fulfillWithValue(res.data);
        })
        .catch((res) => {
            return rejectWithValue(res.response.data);
        });
});

export const reducerDeleteArticleFile = {
    [deleteArticleFile.pending]: (state) => {
        state.deleteArticleFile.loading = true;
    },
    [deleteArticleFile.fulfilled]: (state, action) => {
        state.deleteArticleFile.loading = false;
        state.deleteArticleFile.data = action.payload;
        state.deleteArticleFile.error = null;
    },
    [deleteArticleFile.rejected]: (state, action) => {
        state.deleteArticleFile.loading = false;
        state.deleteArticleFile.error = action.payload;
    }
};