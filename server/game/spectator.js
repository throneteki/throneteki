class Spectator {
    constructor(user) {
        this.user = user;
        this.name = this.user.username;

        this.buttons = [];
        this.menuTitle = 'Spectator mode';
    }
}

module.exports = Spectator;
