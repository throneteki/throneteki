import AbilityContext from './AbilityContext.js';
import BaseAbility from './baseability.js';

const ActiveLocations = ['play area', 'agenda', 'active plot', 'title'];

/**
 * Constant text that applies an effect when a game event occurs ("If you win this challenge, gain
 * 1 power"). It is not triggered: it resolves automatically after the event and before reactions
 * to it, so it cannot be cancelled or declined, and it only applies while the card is active.
 */
class EventCheckAbility extends BaseAbility {
    constructor(game, card, properties) {
        super(Object.assign({ abilitySourceType: 'eventCheck' }, properties));

        this.game = game;
        this.card = card;
        this.when = properties.when;
    }

    createContext(event) {
        return new AbilityContext({
            ability: this,
            event,
            game: this.game,
            player: this.card.controller,
            source: this.card
        });
    }

    isActive() {
        return (
            ActiveLocations.includes(this.card.location) &&
            !this.card.facedown &&
            !this.card.isAnyBlank()
        );
    }

    isTriggeredBy(event) {
        const condition = this.when[event.name];
        return this.isActive() && !!condition && condition(event, this.createContext(event));
    }
}

export default EventCheckAbility;
