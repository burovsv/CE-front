import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateUpdateArticle = {
    updateArticle: { data: null, loading: false, error: null },
};

export const updateArticle = createAsyncThunk('/article/update', async (data, { rejectWithValue, fulfillWithValue }) => {
    return await axios
        .post(`${process.env.REACT_APP_SERVER_API}/article/update`, data, {
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

export const reducerUpdateArticle = {
    [updateArticle.pending]: (state) => {
        state.updateArticle.loading = true;
        state.updateArticle.success = false;
    },
    [updateArticle.fulfilled]: (state, action) => {
        state.updateArticle.loading = false;
        state.updateArticle.data = action.payload;
        state.updateArticle.error = null;
        state.updateArticle.success = true;
    },
    [updateArticle.rejected]: (state, action) => {
        state.updateArticle.loading = false;
        state.updateArticle.error = action.payload;
        state.updateArticle.success = false;
    }
};