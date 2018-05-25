class AnonymousSpectator {
    constructor() {
        this.name = 'Anonymous';

        this.buttons = [];
        this.menuTitle = 'Spectator mode';
    }

    getCardSelectionState() {
        return {};
    }
}

module.exports = AnonymousSpectator;
