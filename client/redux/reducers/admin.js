import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    nodeStatus: []
};

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: () => ({
        receiveNodeStatus: (state, action) => {
            state.nodeStatus = action.payload;
        }
    })
});

export const { receiveNodeStatus } = adminSlice.actions;

export default adminSlice.reducer;
