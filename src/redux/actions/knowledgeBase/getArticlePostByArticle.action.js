import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateGetArticlePostByArticle = {
    getArticlePostByArticle: { data: [], loading: false, error: null },
};

export const getArticlePostByArticle = createAsyncThunk(`articlepost/list/`, async (id, { rejectWithValue, fulfillWithValue }) => {
    return await axios
        .get(`${process.env.REACT_APP_SERVER_API}/articlepost/list/${id}`)
        .then((res) => {
            return fulfillWithValue(res.data);
        })
        .catch((res) => {
            return rejectWithValue(res.response.data);
        });
});

export const reducerGetArticlePostByArticle = {
    [getArticlePostByArticle.pending]: (state) => {
        state.getArticlePostByArticle.loading = true;
    },
    [getArticlePostByArticle.fulfilled]: (state, action) => {
        state.getArticlePostByArticle.loading = false;
        state.getArticlePostByArticle.data = action.payload;
        state.getArticlePostByArticle.error = null;
    },
    [getArticlePostByArticle.rejected]: (state, action) => {
        state.getArticlePostByArticle.loading = false;
        state.getArticlePostByArticle.error = action.payload;
    }
};