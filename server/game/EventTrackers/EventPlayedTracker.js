import CardMatcher from '../CardMatcher.js';

class EventPlayedTracker {
    static forPhase(game) {
        return new EventPlayedTracker(game, 'onPhaseEnded');
    }
    static forRound(game) {
        return new EventPlayedTracker(game, 'onRoundEnded');
    }

    constructor(game, endingEvent) {
        this.events = [];
        // TODO: should be onCardPlayed but it is currently fired after the
        // ability has resolved. That would be too late in case of chains of
        // interrupt cards, e.g. Hand's Judgment vs Hand's Judgment vs Hand's
        // Judgment
        game.on('onCardAbilityInitiated:cancelinterrupt', (event) => this.trackEvent(event));
        game.on(endingEvent, () => this.clearEvents());
    }

    trackEvent(event) {
        if (
            event.source.getType() !== 'event' ||
            this.events.includes(event) ||
            !event.ability.isPlayableEventAbility()
        ) {
            return;
        }

        this.events.push(event);
    }

    clearEvents() {
        this.events = [];
    }

    getNumberOfPlayedEvents(player, playedFromLocation) {
        return this.events.reduce((count, event) => {
            return event.player === player &&
                (!playedFromLocation || playedFromLocation === event.originalLocation)
                ? count + 1
                : count;
        }, 0);
    }

    hasPlayedEvent(player, eventCardPredicateOrMatcher) {
        const predicate =
            typeof eventCardPredicateOrMatcher === 'function'
                ? eventCardPredicateOrMatcher
                : (card) => CardMatcher.isMatch(card, eventCardPredicateOrMatcher);
        return this.events.some((event) => event.player === player && predicate(event.source));
    }
}

export default EventPlayedTracker;
