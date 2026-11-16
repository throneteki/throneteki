import CardMatcher from '../CardMatcher.js';

class CardEntersPlayTracker {
    static forPhase(game) {
        return new CardEntersPlayTracker(game, 'onPhaseEnded');
    }

    static forRound(game) {
        return new CardEntersPlayTracker(game, 'onRoundEnded');
    }

    constructor(game, endingEvent) {
        this.events = [];
        this.controllersOnEntry = new Map();

        game.on('onCardEntersPlay', (event) => this.trackEvent(event));
        game.on(endingEvent, () => this.clearEvents());
        //always clear the events when the setup finishes as the first round wrongly also tracks the setup phase
        game.on('onSetupFinished', () => this.clearEvents());
    }

    trackEvent(event) {
        this.events.push(event);
        this.controllersOnEntry.set(event, event.card.controller);
    }

    clearEvents() {
        this.events = [];
        this.controllersOnEntry.clear();
    }

    // A card returns to its owner's control when it leaves play, so its controller now may not be
    // the player it entered play under.
    controllerOnEntry(event) {
        return this.controllersOnEntry.get(event);
    }

    hasAmbushed(card) {
        return this.events.some((event) => event.card === card && event.playingType === 'ambush');
    }

    hasComeOutOfShadows(card) {
        return this.events.some(
            (event) => event.card === card && event.playingType === 'outOfShadows'
        );
    }

    hasPlayerAmbushedAnyCardWithPredicate(player, cardPredicateOrMatcher) {
        const predicate =
            typeof cardPredicateOrMatcher === 'function'
                ? cardPredicateOrMatcher
                : (card) => CardMatcher.isMatch(card, cardPredicateOrMatcher);
        return this.events.some(
            (event) =>
                event.player === player && event.playingType === 'ambush' && predicate(event.source)
        );
    }

    hasPlayerBroughtOutOfShadowsAnyCardWithPredicate(player, cardPredicateOrMatcher) {
        const predicate =
            typeof cardPredicateOrMatcher === 'function'
                ? cardPredicateOrMatcher
                : (card) => CardMatcher.isMatch(card, cardPredicateOrMatcher);
        return this.events.some(
            (event) =>
                event.player === player &&
                event.playingType === 'outOfShadows' &&
                predicate(event.source)
        );
    }
}

export default CardEntersPlayTracker;
