const AtomicEvent = require('../AtomicEvent');
const Event = require('../event');

/**
 * A game action is anything that changes the state of the game, e.g. draw X
 * cards, kill this character, etc. This class acts as a base class for such
 * actions. Inheritors should override the `canChangeGameState` and
 * `createEvent` methods as necessary, and then export a singleton object
 * instead of the class itself.
 *
 * ```
 * module.exports = new PlaceCard();
 * ```
 */
class GameAction {
    constructor(name) {
        this.name = name;
    }

    /**
     * Returns whether the action would result in the game state changing and
     * thus be allowed to resolve.
     *
     * @param {*} props
     */
    allow(props) {
        return this.canChangeGameState(props) && (!this.isImmune(props) || !!props.force);
    }

    /**
     * Returns whether the game is in a state that would allow the action to be
     * applied (e.g. a card must be standing in order to be kneeled). Inheritors
     * should override.
     *
     * @param {*} props
     */
    canChangeGameState() {
        return true;
    }

    /**
     * Returns whether the target is immune to the action being applied.
     *
     * @param {*} props
     */
    isImmune(props) {
        let { card, context } = props;
        return !!card && !card.allowGameAction(this.name, context);
    }

    /**
     * Creates an event object related to the triggering condition for the
     * action being applied. Inheritors must override.
     */
    createEvent() {
        throw new Error('abstract method `createEvent`');
    }

    event(name, params, handler) {
        return new Event(name, params, handler);
    }

    atomic(...events) {
        let event = new AtomicEvent();
        for (let childEvent of events) {
            event.addChildEvent(childEvent);
        }
        return event;
    }

    message() {
        return '';
    }
}

module.exports = GameAction;
