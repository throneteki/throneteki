const _ = require('underscore');

const BaseStep = require('./basestep');

class IconPrompt extends BaseStep {
    constructor(game, player, context) {
        super(game);

        this.player = player;
        this.context = context;
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
            source: this
        });
    }

    iconSelected(player, icon) {
        this.context.icon = icon;

        return true;
    }
}

module.exports = IconPrompt;
