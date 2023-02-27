import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateGetArticleEmployeePositionByArticle = {
    getArticleEmployeePositionByArticle: { data: [], loading: false, error: null },
};

export const getArticleEmployeePositionByArticle = createAsyncThunk(`articleEmployeePosition/list/`, async (id, { rejectWithValue, fulfillWithValue }) => {
    return await axios
        .get(`${process.env.REACT_APP_SERVER_API}/articleEmployeePosition/list/${id}`)
        .then((res) => {
            return fulfillWithValue(res.data);
        })
        .catch((res) => {
            return rejectWithValue(res.response.data);
        });
});

export const reducerGetArticleEmployeePositionByArticle = {
    [getArticleEmployeePositionByArticle.pending]: (state) => {
        state.getArticleEmployeePositionByArticle.loading = true;
    },
    [getArticleEmployeePositionByArticle.fulfilled]: (state, action) => {
        state.getArticleEmployeePositionByArticle.loading = false;
        state.getArticleEmployeePositionByArticle.data = action.payload;
        state.getArticleEmployeePositionByArticle.error = null;
    },
    [getArticleEmployeePositionByArticle.rejected]: (state, action) => {
        state.getArticleEmployeePositionByArticle.loading = false;
        state.getArticleEmployeePositionByArticle.error = action.payload;
    }
};