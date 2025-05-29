import PlayerPromptState from './playerpromptstate.js';

class Spectator {
    constructor(id, user) {
        this.user = user;
        this.name = this.user.username;
        this.id = id;
        this.cardSize = this.user.settings?.cardSize;
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
            ...promptState
        };
    }
}

export default Spectator;
