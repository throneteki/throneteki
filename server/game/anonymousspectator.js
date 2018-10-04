class AnonymousSpectator {
    constructor() {
        this.name = 'Anonymous';

        this.buttons = [];
        this.menuTitle = 'Spectator mode';
    }

    getCardSelectionState() {
        return {};
    }

    isSpectator() {
        return true;
    }
}

module.exports = AnonymousSpectator;
