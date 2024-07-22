import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentRestrictedList: {}
};

const cardsSlice = createSlice({
    name: 'cards',
    initialState,
    reducers: (create) => ({})
});

export const {} = cardsSlice.actions;

export default cardsSlice.reducer;
