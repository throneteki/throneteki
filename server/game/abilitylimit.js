class FixedAbilityLimit {
    constructor(max) {
        this.max = max;
        this.useCounts = new Map();
    }

    isRepeatable() {
        return false;
    }

    // Limits are player specific (Rules Reference: Limits and Maxima). A use recorded without a
    // player counts against every player.
    get useCount() {
        let total = 0;
        for (const count of this.useCounts.values()) {
            total += count;
        }
        return total;
    }

    getUseCount(player) {
        const shared = this.useCounts.get(undefined) || 0;
        return player ? shared + (this.useCounts.get(player) || 0) : shared;
    }

    isAtMax(context) {
        const max = this.max instanceof Function ? this.max(context) : this.max;
        return this.getUseCount(context?.player) >= max;
    }

    increment(player) {
        this.useCounts.set(player, (this.useCounts.get(player) || 0) + 1);
    }

    reset() {
        this.useCounts = new Map();
    }

    registerEvents() {
        // No event handling
    }

    unregisterEvents() {
        // No event handling
    }
}

class RepeatableAbilityLimit extends FixedAbilityLimit {
    constructor(max, eventName) {
        super(max);

        this.eventName = eventName;
        this.resetHandler = () => this.reset();
    }

    isRepeatable() {
        return true;
    }

    registerEvents(eventEmitter) {
        eventEmitter.on(this.eventName, this.resetHandler);
    }

    unregisterEvents(eventEmitter) {
        eventEmitter.removeListener(this.eventName, this.resetHandler);
        this.reset();
    }
}

var AbilityLimit = {};

AbilityLimit.fixed = function (max) {
    return new FixedAbilityLimit(max);
};

AbilityLimit.repeatable = function (max, eventName) {
    return new RepeatableAbilityLimit(max, eventName);
};

AbilityLimit.perChallenge = function (max) {
    return new RepeatableAbilityLimit(max, 'onChallengeFinished');
};

AbilityLimit.perPhase = function (max) {
    return new RepeatableAbilityLimit(max, 'onPhaseEnded');
};

AbilityLimit.perRound = function (max) {
    return new RepeatableAbilityLimit(max, 'onRoundEnded');
};

AbilityLimit.perGame = function (max) {
    return new RepeatableAbilityLimit(max, 'onGameEnded');
};

export default AbilityLimit;
