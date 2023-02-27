import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateCreateArticleMark = {
    createArticleMark: { data: null, loading: false, error: null },
};

export const createArticleMark = createAsyncThunk('/articlemark/create', async (data, { rejectWithValue, fulfillWithValue }) => {
    return await axios
        .post(`${process.env.REACT_APP_SERVER_API}/articlemark/create`, data)
        .then((res) => {
            return fulfillWithValue(res.data);
        })
        .catch((res) => {
            return rejectWithValue(res.response.data);
        });
});

export const reducerCreateArticleMark = {
    [createArticleMark.pending]: (state) => {
        state.createArticleMark.loading = true;
    },
    [createArticleMark.fulfilled]: (state, action) => {
        state.createArticleMark.loading = false;
        state.createArticleMark.data = action.payload;
        state.createArticleMark.error = null;
    },
    [createArticleMark.rejected]: (state, action) => {
        state.createArticleMark.loading = false;
        state.createArticleMark.error = action.payload;
    }
};