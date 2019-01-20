class Spectator {
    constructor(player) {
        this.name = player.user.name;
        this.id = player.connectionId;

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

module.exports = Spectator;
