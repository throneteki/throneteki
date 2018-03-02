import $ from 'jquery';
import {navigate, setAuthTokens} from '../actions';

export default function callAPIMiddleware({ dispatch, getState }) {
    return next => action => {
        const {
            types,
            APIParams,
            shouldCallAPI = () => true,
            payload = {},
            skipAuth = false
        } = action;

        if(!types) {
            return next(action);
        }

        if(!Array.isArray(types) || types.length !== 2 || !types.every(type => typeof type === 'string')) {
            throw new Error('Expected an array of two string types.');
        }

        const [requestType, successType] = types;

        dispatch(Object.assign({}, payload, {
            type: requestType
        }));

        if(!shouldCallAPI(getState())) {
            return;
        }

        dispatch(Object.assign({}, payload, {
            type: 'API_LOADING',
            request: requestType
        }));

        let apiParams = APIParams;
        if(!skipAuth && apiParams) {
            apiParams.headers = {
                Authorization: `Bearer ${getState().auth.token}`,
                'Content-Type': 'application/json'
            };
        }

        return $.ajax(apiParams.url, apiParams).then(
            response => {
                if(!response.success) {
                    return dispatch(Object.assign({}, payload, {
                        status: 200,
                        message: response.message,
                        type: 'API_FAILURE',
                        request: requestType
                    }));
                }

                let ret = dispatch(Object.assign({}, payload, {
                    response,
                    type: successType
                }));

                dispatch(Object.assign({}, payload, {
                    type: 'API_LOADED',
                    request: requestType
                }));

                return ret;
            },
            error => {
                if(error.status === 401) {
                    let state = getState();

                    $.ajax('/api/account/token', {
                        type: 'POST',
                        data: {
                            token: JSON.stringify(state.auth.refreshToken)
                        }
                    }).then(response => {
                        if(response.success) {
                            apiParams.headers = {
                                Authorization: `Bearer ${response.token}`,
                                'Content-Type': 'application/json'
                            };

                            dispatch(setAuthTokens(response.token, state.auth.refreshToken));
                        } else {
                            return dispatch(navigate('/login'));
                        }

                        return $.ajax(apiParams.url, apiParams).then(
                            response => {
                                if(!response.success) {
                                    return dispatch(Object.assign({}, payload, {
                                        status: 200,
                                        message: response.message,
                                        type: 'API_FAILURE',
                                        request: requestType
                                    }));
                                }

                                let ret = dispatch(Object.assign({}, payload, {
                                    response,
                                    type: successType
                                }));

                                dispatch(Object.assign({}, payload, {
                                    type: 'API_LOADED',
                                    request: requestType
                                }));

                                return ret;
                            },
                            error => {
                                if(error.status === 401) {
                                    return dispatch(navigate('/login'));
                                }

                                dispatch(Object.assign({}, payload, {
                                    status: error.status,
                                    message: 'An error occured communicating with the server.  Please try again later.',
                                    type: 'API_LOADED',
                                    request: requestType
                                }));

                                dispatch(Object.assign({}, payload, {
                                    status: error.status,
                                    message: 'An error occured communicating with the server.  Please try again later.',
                                    type: 'API_FAILURE',
                                    request: requestType
                                }));
                            });
                    });

                    return;
                }

                dispatch(Object.assign({}, payload, {
                    status: error.status,
                    message: 'An error occured communicating with the server.  Please try again later.',
                    type: 'API_LOADED',
                    request: requestType
                }));

                dispatch(Object.assign({}, payload, {
                    status: error.status,
                    message: 'An error occured communicating with the server.  Please try again later.',
                    type: 'API_FAILURE',
                    request: requestType
                }));
            }
        );
    };
}

