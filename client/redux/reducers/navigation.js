/* global window, history */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentRestrictedList: {}
};

const navigationSlice = createSlice({
    name: 'naivgation',
    initialState,
    reducers: (create) => ({
        navigate: create.preparedReducer(
            (newPath, search) => {
                return { payload: { newPath, search } };
            },
            (state, action) => {
                try {
                    window.history.pushState(
                        {},
                        '',
                        action.payload.newPath + (action.payload.search || '')
                    );

                    state.path = action.payload.newPath;
                    state.search = action.payload.search;
                } catch (_) {
                    // eslint-disable-empty-block
                }
            }
        ),
        setContextMenu: (state, action) => {
            state.contextMenu = action.payload;
        },
        setUrl: (state, action) => {
            history.replaceState({}, '', action.payload);
        }
    })
});

export const { navigate, setContextMenu, setUrl } = navigationSlice.actions;

export default navigationSlice.reducer;
