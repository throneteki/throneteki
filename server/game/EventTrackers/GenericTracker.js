class GenericTracker {
    static forPhase(game, startingEvent) {
        return new GenericTracker(game, startingEvent, 'onPhaseEnded');
    }

    constructor(game, startingEvent, endingEvent) {
        this.events = [];

        game.on(startingEvent, event => this.trackEvent(event));
        game.on(endingEvent, () => this.clearEvents());
    }

    some(predicate) {
        return this.events.some(predicate);
    }

    trackEvent(event) {
        this.events.push(event);
    }

    clearEvents() {
        this.events = [];
    }
}

module.exports = GenericTracker;
