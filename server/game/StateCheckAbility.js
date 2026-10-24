import AbilityContext from './AbilityContext.js';
import BaseAbility from './baseability.js';
import { Requirements } from './Constants/index.js';

/**
 * Card text of the form "If <condition>, <effect>." It is not triggered: the game applies the
 * effect as soon as the condition holds, so it cannot be cancelled or declined.
 */
class StateCheckAbility extends BaseAbility {
    constructor(game, card, properties) {
        super(Object.assign({ abilitySourceType: 'stateCheck' }, properties));

        this.game = game;
        this.card = card;
        this.condition = properties.condition;
    }

    createContext() {
        return new AbilityContext({
            ability: this,
            game: this.game,
            player: this.card.controller,
            source: this.card
        });
    }

    isActive() {
        return (
            this.card.location === 'play area' &&
            !this.card.facedown &&
            !this.card.isAnyBlank() &&
            this.game.currentPhase !== 'setup'
        );
    }

    getUnmetRequirement(context) {
        return this.isActive() && this.condition(context) ? undefined : Requirements.condition;
    }
}

export default StateCheckAbility;
