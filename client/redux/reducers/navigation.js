import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentRestrictedList: {}
};

const navigationSlice = createSlice({
    name: 'naivgation',
    initialState,
    reducers: (create) => ({
        navigate: create.preparedReducer(
            (newPath, search, replace = false) => {
                return { payload: { newPath, search, replace } };
            },
            (state, action) => {
                try {
                    const url = action.payload.newPath + (action.payload.search || '');
                    if (action.payload.replace) {
                        window.history.replaceState({}, '', url);
                    } else {
                        window.history.pushState({}, '', url);
                    }

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
