import { createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateUploadArticleImage = {
    uploadArticleImage: { data: null, loading: false, error: null },
};

export const uploadArticleImage = createAsyncThunk('/article/image/upload', async (data, { rejectWithValue, fulfillWithValue }) => {

    let formData = new FormData();
    formData.append('file', data);

    return await axios
        .post(`${process.env.REACT_APP_SERVER_API}/article/image/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
              }
        })
        .then((res) => {
            return fulfillWithValue(res.data);
        })
        .catch((res) => {
            return rejectWithValue(res.response.data);
        });
});

export const reducerUploadArticleImage = {
    [uploadArticleImage.pending]: (state) => {
        state.uploadArticleImage.loading = true;
        state.uploadArticleImage.success = false;
    },
    [uploadArticleImage.fulfilled]: (state, action) => {
        state.uploadArticleImage.loading = false;
        state.uploadArticleImage.data = action.payload;
        state.uploadArticleImage.error = null;
        state.uploadArticleImage.success = true;
    },
    [uploadArticleImage.rejected]: (state, action) => {
        state.uploadArticleImage.loading = false;
        state.uploadArticleImage.error = action.payload;
        state.uploadArticleImage.success = false;
    }
};