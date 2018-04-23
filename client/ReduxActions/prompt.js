import { sendGameMessage } from './socket';

export function startAbilityTimer(timeLimit) {
    return dispatch => {
        let started = new Date();

        let handle = setTimeout(() => {
            dispatch(expireAbilityTimer());
        }, timeLimit * 1000);

        dispatch({
            type: 'START_ABILITY_TIMER',
            startTime: started,
            limit: timeLimit,
            handle: handle
        });
    };
}

export function stopAbilityTimer() {
    return {
        type: 'STOP_ABILITY_TIMER'
    };
}

export function expireAbilityTimer() {
    return dispatch => {
        dispatch(stopAbilityTimer());
        dispatch(sendGameMessage('menuButton', null, 'pass'));
    };
}
