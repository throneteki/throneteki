const EventToTitleFunc = {
    onCardAbilityInitiated: event => 'the effects of ' + event.source.name,
    onCardPowerChanged: event => event.params[1].name + ' gaining power',
    onCharacterKilled: event => event.card.name + ' being killed',
    onCharactersKilled: () => 'characters being killed',
    onPhaseEnded: event => event.params[1] + ' phase ending',
    onPhaseStarted: event => event.params[1] + ' phase starting',
    onSacrificed: event => event.params[2].name + ' being sacrificed',
    onRemovedFromChallenge: event => event.card.name + ' being removed from the challenge'
};

const AbilityTypeToWord = {
    cancelinterrupt: 'interrupt',
    interrupt: 'interrupt',
    reaction: 'reaction',
    forcedreaction: 'forced reaction',
    forcedinterrupt: 'forced interrupt',
    whenrevealed: 'when revealed'
};

const AbilityWindowTitles = {
    getTitle: function(abilityType, event) {
        let abilityWord = AbilityTypeToWord[abilityType] || abilityType;
        let titleFunc = EventToTitleFunc[event.name];

        if(['forcedreaction', 'forcedinterrupt', 'whenrevealed'].includes(abilityType)) {
            if(titleFunc) {
                return 'Choose ' + abilityWord + ' order for ' + titleFunc(event);
            }

            return 'Choose ' + abilityWord + ' order';
        }

        if(titleFunc) {
            return 'Any ' + abilityWord + 's to ' + titleFunc(event) + '?';
        }

        return 'Any ' + abilityWord + 's?';
    }
};

module.exports = AbilityWindowTitles;
