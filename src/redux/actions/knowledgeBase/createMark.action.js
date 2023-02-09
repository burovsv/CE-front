import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateCreateMark = {
    createMark: { data: null, loading: false, error: null },
};

export const createMark = createAsyncThunk('/mark/create', async ({ name }, { rejectWithValue, fulfillWithValue }) => {
    return await axios
        .post(`${process.env.REACT_APP_SERVER_API}/mark/create`, { name })
        .then((res) => {
            return fulfillWithValue(res.data);
        })
        .catch((res) => {
            return rejectWithValue(res.response.data);
        });
});

export const reducerCreateMark = {
    [createMark.pending]: (state) => {
        state.createMark.loading = true;
    },
    [createMark.fulfilled]: (state, action) => {
        state.createMark.loading = false;
        state.createMark.data = action.payload;
        state.createMark.error = null;
    },
    [createMark.rejected]: (state, action) => {
        state.createMark.loading = false;
        state.createMark.error = action.payload;
    }
};
