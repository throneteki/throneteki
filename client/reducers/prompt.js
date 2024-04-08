export default function(state = {}, action) {
    switch(action.type) {
        case 'START_ABILITY_TIMER':
            return Object.assign({}, state, {
                timerStartTime: action.startTime,
                timerLimit: action.limit,
                timerHandle: action.handle
            });
        case 'STOP_ABILITY_TIMER':
            if(state.timerHandle) {
                clearTimeout(state.timerHandle);
            }

            return Object.assign({}, state, {
                timerStartTime: null,
                timerLimit: null,
                timerHandle: null
            });
        case 'OPEN_ROOKERY_PROMPT':
            return Object.assign({}, state, {
                rookeryDeck: action.deck,
                rookeryPromptId: action.promptId
            });
        case 'CLOSE_ROOKERY_PROMPT':
            return Object.assign({}, state, {
                rookeryDeck: null,
                rookeryPromptId: null
            });
    }

    return state;
}
