import { createSlice } from '@reduxjs/toolkit';
export const initialState = {
  auth: undefined,
  activeModal: '',
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAuth(state, action) {
      state.auth = action.payload;
    },
    setActiveModal(state, action) {
      state.activeModal = action.payload;
    },
  },
});
export const { setAuth, setActiveModal } = appSlice.actions;
export const appReducer = appSlice.reducer;
