
function createEachPlayerTargetingForCardType(cardType) {
    return {
        noneSelected: `{targetSelection.choosingPlayer} chooses no ${cardType} for {source}`,
        selected: '{targetSelection.choosingPlayer} chooses {targetSelection.value} for {source}',
        skipped: {
            type: 'danger',
            format: `{targetSelection.choosingPlayer} has ${cardType} to choose for {source} but did not choose any`
        },
        unable: `{targetSelection.choosingPlayer} has no ${cardType} to choose for {source}`
    };
}

const Messages = {
    eachPlayerTargeting: createEachPlayerTargetingForCardType('cards'),
    eachPlayerTargetingForCardType: createEachPlayerTargetingForCardType
};

module.exports = Messages;
