import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateCreateSectionGroup = {
    createSectionGroup: { data: null, loading: false, error: null },
};

export const createSectionGroup = createAsyncThunk('sectionGroup/create', async ({ name }, { rejectWithValue, fulfillWithValue }) => {
    return await axios
        .post(`${process.env.REACT_APP_SERVER_API}/sectionGroup/create`, { name })
        .then((res) => {
            return fulfillWithValue(res.data);
        })
        .catch((res) => {
            return rejectWithValue(res.response.data);
        });
});

export const reducerCreateSectionGroup = {
    [createSectionGroup.pending]: (state) => {
        state.createSectionGroup.loading = true;
    },
    [createSectionGroup.fulfilled]: (state, action) => {
        state.createSectionGroup.loading = false;
        state.createSectionGroup.data = action.payload;
        state.createSectionGroup.error = null;
    },
    [createSectionGroup.rejected]: (state, action) => {
        state.createSectionGroup.loading = false;
        state.createSectionGroup.error = action.payload;
    }
};
