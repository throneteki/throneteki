import PlayerPromptState from './playerpromptstate.js';

class Spectator {
    constructor(id, user) {
        this.user = user;
        this.name = this.user.username;
        this.id = id;
        this.cardSize = this.user.settings?.cardSize;
        this.promptDupes = user.settings?.promptDupes;
        this.timerSettings = user.settings?.timerSettings || {};
        this.timerSettings.windowTimer = user.settings?.windowTimer;
        this.keywordSettings = user.settings?.keywordSettings;
        this.promptedActionWindows = user.promptedActionWindows;
        this.promptState = new PlayerPromptState();
        this.setPrompt({ menuTitle: 'Spectator mode' });
    }

    getCardSelectionState() {
        return {};
    }

    isSpectator() {
        return true;
    }

    currentPrompt() {
        return this.promptState.getState();
    }

    setPrompt(prompt) {
        this.promptState.setPrompt(prompt);
    }

    getState() {
        const promptState = this.promptState.getState();
        return {
            id: this.id,
            name: this.name,
            cardSize: this.cardSize,
            promptDupes: this.promptDupes,
            timerSettings: this.timerSettings,
            keywordSettings: this.keywordSettings,
            promptedActionWindows: this.promptedActionWindows,
            ...promptState,
            canSafelyLeave: true
        };
    }
}

export default Spectator;
