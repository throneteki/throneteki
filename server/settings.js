const defaultWindows = {
    plot: false,
    draw: false,
    challengeBegin: false,
    attackersDeclared: true,
    defendersDeclared: true,
    dominance: false,
    standing: false
};

const defaultSettings = {
    disableGravatar: false,
    windowTimer: 10
};

const defaultTimerSettings = {
    events: true,
    abilities: false
};

function getUserWithDefaultsSet(user) {
    let userToReturn = user;

    if(!userToReturn) {
        return userToReturn;
    }

    userToReturn.settings = Object.assign({}, defaultSettings, userToReturn.settings);
    userToReturn.settings.timerSettings = Object.assign({}, defaultTimerSettings, userToReturn.settings.timerSettings);
    userToReturn.settings.permissions = Object.assign({}, userToReturn.permissions);
    userToReturn.settings.promptedActionWindows = Object.assign({}, defaultWindows, userToReturn.promptedActionWindows);

    return userToReturn;
}

module.exports = {
    getUserWithDefaultsSet: getUserWithDefaultsSet
};
