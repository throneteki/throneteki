function games(state = {}, action) {
    switch(action.type) {
        case 'START_NEWGAME':
            return Object.assign({}, state, {
                newGame: true
            });
        case 'CANCEL_NEWGAME':
            return Object.assign({}, state, {
                newGame: false
            });
        case 'GAME_SOCKET_CLOSED':
            return Object.assign({}, state, {
                currentGame: undefined
            });
        case 'JOIN_PASSWORD_GAME':
            return Object.assign({}, state, {
                passwordGame: action.game,
                passwordJoinType: action.joinType
            });
        case 'CANCEL_PASSWORD_JOIN':
            return Object.assign({}, state, {
                passwordGame: undefined,
                passwordError: undefined,
                passwordJoinType: undefined
            });
        default:
            return state;
    }
}

export default games;
