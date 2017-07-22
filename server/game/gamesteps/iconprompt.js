const _ = require('underscore');

const BaseStep = require('./basestep');

class IconPrompt extends BaseStep {
    constructor(game, player, card, callback) {
        super(game);

        this.player = player;
        this.card = card;
        this.callback = callback;
    }

    continue() {
        let icons = ['Military', 'Intrigue', 'Power'];

        let buttons = _.map(icons, icon => {
            return { text: icon, method: 'iconSelected', arg: icon.toLowerCase() };
        });

        this.game.promptWithMenu(this.player, this, {
            activePrompt: {
                menuTitle: 'Select an icon',
                buttons: buttons
            },
            source: this.card
        });
    }

    iconSelected(player, icon) {
        this.callback(icon);

        return true;
    }
}

module.exports = IconPrompt;
