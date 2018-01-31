function news(state = {
    news: []
}, action) {
    switch(action.type) {
        case 'REQUEST_NEWS':
            return Object.assign({}, state, {
            });
        case 'RECEIVE_NEWS':
            return Object.assign({}, state, {
                news: action.response.news
            });
        case 'NEWS_ADDED':
            return Object.assign({}, state, {
                newsSaved: true
            });
        case 'DELETE_NEWS':
            return Object.assign({}, state, {
                newsDeleted: false,
                newsSaved: false
            });
        case 'NEWS_DELETED':
            return Object.assign({}, state, {
                newsDeleted: true
            });
        case 'CLEAR_NEWS_STATUS':
            return Object.assign({}, state, {
                newsSaved: false,
                newsDeleted: false
            });
        default:
            return state;
    }
}

export default news;
