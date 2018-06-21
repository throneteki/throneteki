const BaseStep = require('./basestep');
const ChallengeTypes = require('../ChallengeTypes');

class IconPrompt extends BaseStep {
    constructor(game, player, card, callback) {
        super(game);

        this.player = player;
        this.card = card;
        this.callback = callback;
    }

    continue() {
        this.game.promptWithMenu(this.player, this, {
            activePrompt: {
                menuTitle: 'Select an icon',
                buttons: ChallengeTypes.asButtons({ method: 'iconSelected' })
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
