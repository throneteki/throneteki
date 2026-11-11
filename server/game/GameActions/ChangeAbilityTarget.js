import GameAction from './GameAction.js';

class ChangeAbilityTarget extends GameAction {
    constructor() {
        super('changeAbilityTarget');
    }

    canChangeGameState({ selection, card }) {
        return !!selection && !!card && selection.value !== card && selection.isEligible(card);
    }

    createEvent({ selection, card }) {
        return this.event('__PLACEHOLDER_EVENT__', {}, () => {
            selection.resolve(card);
        });
    }
}

export default new ChangeAbilityTarget();
