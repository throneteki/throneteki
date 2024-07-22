import thunkMiddleware from 'redux-thunk';
import { reducer as toastrReducer } from 'react-redux-toastr';
import * as Sentry from '@sentry/react';
import { configureStore } from '@reduxjs/toolkit';
import auth from './redux/reducers/auth.js';
import { apiSlice } from './redux/middleware/api';
import lobbyMiddleware from './redux/middleware/lobby';
import lobby from './redux/reducers/lobby';
import cards from './redux/reducers/cards';
import admin from './redux/reducers/admin';
import navigation from './redux/reducers/navigation.js';
import game from './redux/reducers/game.js';
import gameMiddleware from './redux/middleware/game.js';

const sentryReduxEnhancer = Sentry.createReduxEnhancer({
    attachReduxState: true,
    actionTransformer: (action) => {
        return action;
    }
});
export const store = configureStore({
    reducer: {
        admin,
        api: apiSlice.reducer,
        auth,
        cards,
        navigation,
        lobby,
        game,
        toastr: toastrReducer
    },
    enhancers: (getDefaultEnhancers) => {
        return getDefaultEnhancers().concat(sentryReduxEnhancer);
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(thunkMiddleware)
            .concat(apiSlice.middleware)
            .concat(gameMiddleware)
            .concat(lobbyMiddleware)
});
