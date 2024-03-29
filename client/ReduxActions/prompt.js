import { formatDeckAsFullCards } from 'throneteki-deck-helper';

import { sendGameMessage } from './socket';

export function startAbilityTimer(timeLimit, timerProps) {
    return dispatch => {
        let started = new Date();

        let handle = setTimeout(() => {
            dispatch(expireAbilityTimer(timerProps));
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

export function expireAbilityTimer(timerProps) {
    return dispatch => {
        dispatch(stopAbilityTimer());
        dispatch(sendGameMessage('menuButton', timerProps.arg, timerProps.method, timerProps.promptId));
    };
}

export function openRookeryPrompt(rookery) {
    return (dispatch, getState) => {
        let state = getState();
        let formattedDeck = formatDeckAsFullCards(rookery.deck, state.cards);
        dispatch({
            type: 'OPEN_ROOKERY_PROMPT',
            deck: formattedDeck,
            promptId: rookery.promptId
        });
    };
}

export function submitRookeryPrompt(deck, promptId) {
    return dispatch => {
        dispatch(sendGameMessage('menuButton', deck, null, promptId));
    };
}

export function closeRookeryPrompt() {
    return {
        type: 'CLOSE_ROOKERY_PROMPT'
    };
}
