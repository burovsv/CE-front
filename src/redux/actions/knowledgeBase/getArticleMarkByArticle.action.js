import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateGetArticleMarkByArticle = {
    getArticleMarkByArticle: { data: [], loading: false, error: null },
};

export const getArticleMarkByArticle = createAsyncThunk(`articlemark/list/`, async (id, { rejectWithValue, fulfillWithValue }) => {
    return await axios
        .get(`${process.env.REACT_APP_SERVER_API}/articlemark/list/${id}`)
        .then((res) => {
            return fulfillWithValue(res.data);
        })
        .catch((res) => {
            return rejectWithValue(res.response.data);
        });
});

export const reducerGetArticleMarkByArticle = {
    [getArticleMarkByArticle.pending]: (state) => {
        state.getArticleMarkByArticle.loading = true;
    },
    [getArticleMarkByArticle.fulfilled]: (state, action) => {
        state.getArticleMarkByArticle.loading = false;
        state.getArticleMarkByArticle.data = action.payload;
        state.getArticleMarkByArticle.error = null;
    },
    [getArticleMarkByArticle.rejected]: (state, action) => {
        state.getArticleMarkByArticle.loading = false;
        state.getArticleMarkByArticle.error = action.payload;
    }
};