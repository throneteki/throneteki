const _ = require('underscore');

const BaseStep = require('./basestep');

class BestowPrompt extends BaseStep {
    constructor(game, player, card) {
        super(game);

        this.player = player;
        this.card = card;
    }

    continue() {
        let limit = Math.min(this.player.getSpendableGold({ activePlayer: this.player }), this.card.getBestowMax());
        let range = _.range(1, limit + 1).reverse();

        if(limit === 0) {
            return;
        }

        let buttons = _.map(range, gold => {
            return { text: gold.toString(), method: 'bestow', arg: gold };
        });
        buttons.push({ text: 'Done', method: 'bestow', arg: 0 });

        this.game.promptWithMenu(this.player, this, {
            activePrompt: {
                menuTitle: 'Select bestow amount for ' + this.card.name,
                buttons: buttons
            },
            source: this.card
        });
    }

    bestow(player, gold) {
        if(gold === 0) {
            return true;
        }

        if(gold > this.player.getSpendableGold({ activePlayer: this.player })) {
            return false;
        }

        this.game.transferGold({ from: player, to: this.card, amount: gold, activePlayer: this.player });
        this.game.addMessage('{0} bestows {1} gold on {2}', this.player, gold, this.card);

        return true;
    }
}

module.exports = BestowPrompt;
