const cancellableEvents = {
    onCardAbilityInitiated: 'cancelinterrupt',
    onClaimApplied: 'interrupt'
};

class CancelTimer {
    constructor(event, abilityType) {
        this.event = event;
        this.abilityType = abilityType;
    }

    isEnabled(player) {
        return player.isTimerEnabled() && this.hasCancellableEvent(player);
    }

    hasCancellableEvent(player) {
        return this.event.getConcurrentEvents().some((event) => {
            return (
                !event.cancelled &&
                event.player !== player &&
                cancellableEvents[event.name] &&
                cancellableEvents[event.name] === this.abilityType &&
                this.isWindowEnabledForEvent(player, event)
            );
        });
    }

    isWindowEnabledForEvent(player, event) {
        let eventsEnabled = player.timerSettings.events;
        let abilitiesEnabled = player.timerSettings.abilities;

        if (event.name === 'onCardAbilityInitiated') {
            if (event.source.getType() === 'event') {
                return eventsEnabled;
            }

            return abilitiesEnabled;
        }

        // Must be onClaimApplied, which we tie to events setting
        return eventsEnabled;
    }
}

module.exports = CancelTimer;
