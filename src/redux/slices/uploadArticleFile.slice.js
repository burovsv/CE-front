import { createSlice } from '@reduxjs/toolkit';
import { initStateUploadArticleFile, reducerUploadArticleFile} from '../actions/knowledgeBase/uploadArticleFile.action';
import { initStateUploadArticleImage, reducerUploadArticleImage} from '../actions/knowledgeBase/uploadArticleImage.action';


export const initialState = {
    ...initStateUploadArticleFile,
    ...initStateUploadArticleImage,
  };
  
export const uploadArticleFileSlice = createSlice({
    name: 'uploadArticleFile',
    initialState,
    reducers: {
      resetUploadArticleFile(state) {
        state.uploadArticleFile = initStateUploadArticleFile.uploadArticleFile;
      },
      resetUploadArticleImage(state) {
        state.uploadArticleImage = initStateUploadArticleImage.uploadArticleImage;
      },
    },
    extraReducers: {
      ...reducerUploadArticleFile,
      ...reducerUploadArticleImage,
    },
  });
  export const { resetUploadArticleFile, resetUploadArticleImage } = uploadArticleFileSlice.actions;
  export const uploadArticleFileReducer = uploadArticleFileSlice.reducer;