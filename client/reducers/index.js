import { combineReducers } from 'redux';
import navigation from './navigation';
import auth from './auth';
import cards from './cards';
import events from './events';
import games from './games';
import news from './news';
import api from './api';
import admin from './admin';
import user from './user';
import account from './account';
import lobby from './lobby';
import prompt from './prompt';
import { reducer as toastrReducer } from 'react-redux-toastr';

const rootReducer = combineReducers({
    navigation,
    auth,
    cards,
    events,
    games,
    news,
    toastr: toastrReducer,
    api,
    admin,
    user,
    account,
    lobby,
    prompt
});

export default rootReducer;
