/**
 * The commands a client is allowed to send to a game. The game server only dispatches
 * messages to methods defined on this class, so anything added here is callable by any
 * connected player or spectator. Each command receives the sending user's name first.
 */
class GameCommands {
    /**
     * @param {import('./game.js').default} game
     */
    constructor(game) {
        this.game = game;
    }

    /**
     * @param {string} command
     * @returns {boolean}
     */
    static isCommand(command) {
        return (
            typeof command === 'string' &&
            command !== 'constructor' &&
            Object.hasOwn(GameCommands.prototype, command) &&
            typeof GameCommands.prototype[command] === 'function'
        );
    }

    cardClicked(playerName, cardId) {
        return this.game.cardClicked(playerName, cardId);
    }

    cardSizeChange(playerName, value) {
        return this.game.cardSizeChange(playerName, value);
    }

    changeStat(playerName, stat, value) {
        return this.game.changeStat(playerName, stat, value);
    }

    chat(playerName, message) {
        if (typeof message !== 'string') {
            return;
        }

        return this.game.chat(playerName, message);
    }

    concede(playerName) {
        return this.game.concede(playerName);
    }

    drop(playerName, cardId, source, target) {
        return this.game.drop(playerName, cardId, source, target);
    }

    menuButton(playerName, arg, method, promptId) {
        return this.game.menuButton(playerName, arg, method, promptId);
    }

    menuItemClick(playerName, cardId, menuItem) {
        if (!menuItem || typeof menuItem !== 'object') {
            return;
        }

        return this.game.menuItemClick(playerName, cardId, menuItem);
    }

    showDrawDeck(playerName, newValue) {
        return this.game.showDrawDeck(playerName, newValue);
    }

    shuffleDeck(playerName) {
        return this.game.shuffleDeck(playerName);
    }

    toggleDupes(playerName, toggle) {
        return this.game.toggleDupes(playerName, !!toggle);
    }

    toggleKeywordSetting(playerName, settingName, toggle) {
        if (!this.isExistingSetting(playerName, 'keywordSettings', settingName)) {
            return;
        }

        return this.game.toggleKeywordSetting(playerName, settingName, !!toggle);
    }

    toggleMuteSpectators(playerName) {
        return this.game.toggleMuteSpectators(playerName);
    }

    togglePromptedActionWindow(playerName, windowName, toggle) {
        if (!this.isExistingSetting(playerName, 'promptedActionWindows', windowName)) {
            return;
        }

        return this.game.togglePromptedActionWindow(playerName, windowName, !!toggle);
    }

    toggleTimerSetting(playerName, settingName, toggle) {
        if (!this.isExistingSetting(playerName, 'timerSettings', settingName)) {
            return;
        }

        return this.game.toggleTimerSetting(playerName, settingName, !!toggle);
    }

    isExistingSetting(playerName, settingsProperty, settingName) {
        const player = this.game.getPlayerByName(playerName);

        return (
            !!player &&
            typeof settingName === 'string' &&
            !!player[settingsProperty] &&
            Object.hasOwn(player[settingsProperty], settingName)
        );
    }
}

export default GameCommands;
