import GameAction from './GameAction.js';
import NullEvent from '../NullEvent.js';

class NullableGameAction extends GameAction {
    constructor() {
        super('null');
    }

    message() {
        return '';
    }

    allow() {
        return false;
    }

    createEvent() {
        return new NullEvent();
    }
}

export default new NullableGameAction();
