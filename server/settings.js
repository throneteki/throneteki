const defaultWindows = {
    plot: false,
    draw: false,
    marshal: false,
    challengeBegin: false,
    attackersDeclared: true,
    defendersDeclared: true,
    dominance: false,
    standing: false,
    taxation: false
};

const defaultKeywordSettings = {
    chooseOrder: false,
    chooseCards: false
};

const defaultSettings = {
    background: 'BG1',
    cardSize: 'normal',
    promptDupes: false,
    hideInterrupts: true,
    hideReactions: true,
    keyboardShortcuts: true
};

function getUserWithDefaultsSet(user) {
    let userToReturn = user;

    if (!userToReturn) {
        return userToReturn;
    }

    userToReturn.settings = Object.assign({}, defaultSettings, userToReturn.settings);
    userToReturn.settings.keywordSettings = Object.assign(
        {},
        defaultKeywordSettings,
        userToReturn.settings.keywordSettings
    );
    userToReturn.permissions = Object.assign({}, userToReturn.permissions);
    userToReturn.promptedActionWindows = Object.assign(
        {},
        defaultWindows,
        userToReturn.promptedActionWindows
    );
    if (!userToReturn.blockList) {
        userToReturn.blockList = [];
    }

    return userToReturn;
}

export default {
    defaultSettings,
    getUserWithDefaultsSet: getUserWithDefaultsSet
};
