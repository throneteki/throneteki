import AbilityContext from './AbilityContext.js';
import BaseAbility from './baseability.js';
import { Requirements } from './Constants/index.js';

/**
 * Agenda text of the form "After all agendas are announced, <effect>." It is not triggered: the
 * setup phase resolves it once every agenda has been announced, so it cannot be cancelled.
 */
class AgendaSetupAbility extends BaseAbility {
    constructor(game, card, properties) {
        super(Object.assign({ abilitySourceType: 'agendaSetup' }, properties));

        this.game = game;
        this.card = card;
    }

    createContext() {
        return new AbilityContext({
            ability: this,
            game: this.game,
            player: this.card.controller,
            source: this.card
        });
    }

    getUnmetRequirement() {
        return this.card.location === 'agenda' && !this.card.isAnyBlank()
            ? undefined
            : Requirements.condition;
    }
}

export default AgendaSetupAbility;
