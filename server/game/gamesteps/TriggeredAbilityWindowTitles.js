const EventToTitle = {
    onCardAbilityInitiated: (event) => `the effects of ${event.source.name}`,
    onCardEntersPlay: (event) => `${event.card.name} entering play`,
    onCardPowerGained: (event) => `${event.card.name} gaining power`,
    onCardPowerMoved: (event) => `power moved from ${event.source.name} to ${event.target.name}`,
    onCardReturnedToHand: (event) => `${event.card.name} being returned to hand`,
    onClaimApplied: () => 'claim effects being applied',
    onCharacterKilled: {
        single: (event) => `${event.card.name} being killed`,
        simultaneous: () => 'characters being killed'
    },
    onIconGained: (event) => `${event.card.name} gaining an icon`,
    onIconLost: (event) => `${event.card.name} losing an icon`,
    onPhaseEnded: (event) => `${event.phase} phase ending`,
    onPhaseStarted: (event) => `${event.phase} phase starting`,
    onRemovedFromChallenge: (event) => `${event.card.name} being removed from the challenge`,
    onSacrificed: (event) => `${event.card.name} being sacrificed`,
    onTargetsChosen: () => 'targets being chosen'
};

const AbilityTypeToWord = {
    cancelinterrupt: 'interrupt',
    wouldinterrupt: 'interrupt',
    interrupt: 'interrupt',
    reaction: 'reaction',
    forcedreaction: 'forced reaction',
    forcedinterrupt: 'forced interrupt',
    whenrevealed: 'when revealed'
};

// Name the kills, discards or power moves of a claim, which share its window, rather than the claim.
function withClaimEffects(events) {
    if (events.length !== 1 || events[0].name !== 'onClaimApplied') {
        return events;
    }

    const effects = events[0].childEvents.flatMap((event) => event.getPrimaryEvents());
    return effects.length > 0 ? effects : events;
}

const AbilityWindowTitles = {
    getTitle: function (abilityType, events) {
        events = withClaimEffects(events);
        const abilityWord = AbilityTypeToWord[abilityType] || abilityType;
        const event = events[0];
        let eventTitle = EventToTitle[event.name];
        eventTitle =
            !eventTitle || typeof eventTitle === 'function' ? { single: eventTitle } : eventTitle;
        let titleFunc = events.length > 1 ? eventTitle.simultaneous : eventTitle.single;

        if (['forcedreaction', 'forcedinterrupt', 'whenrevealed'].includes(abilityType)) {
            if (titleFunc) {
                return `Choose ${abilityWord} order for ${titleFunc(event)}`;
            }

            return `Choose ${abilityWord} order`;
        }

        if (titleFunc) {
            return `Any ${abilityWord}s to ${titleFunc(event)}?`;
        }

        return `Any ${abilityWord}s?`;
    }
};

export default AbilityWindowTitles;
