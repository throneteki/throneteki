const _ = require('underscore');

const DrawCard = require('../../drawcard.js');

class LannisportTreasury extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPhaseStarted: event => event.phase === 'taxation' && this.controller.gold >= 1
            },
            handler: () => {
                this.game.addGold(this.controller, -1);
                this.modifyToken('gold', 1);
                this.game.addMessage('{0} moves 1 gold from their gold pool to {1}', this.controller, this);
            }
        });

        this.action({
            title: 'Move gold to gold pool',
            phase: 'marshal',
            condition: () => this.hasToken('gold'),
            cost: ability.costs.kneelSelf(),
            handler: context => {
                let range = _.range(1, this.tokens['gold'] + 1).reverse();
                let buttons = _.map(range, gold => {
                    return { text: gold, method: 'moveGold', arg: gold };
                });

                this.game.promptWithMenu(context.player, this, {
                    activePrompt: {
                        menuTitle: 'Select gold amount',
                        buttons: buttons
                    },
                    source: this
                });
            }
        });
    }

    moveGold(player, gold) {
        this.modifyToken('gold', -gold);
        this.game.addGold(player, gold);
        this.game.addMessage('{0} moves {1} gold from {2} to their gold pool', this.controller, gold, this);

        return true;
    }
}

LannisportTreasury.code = '05019';

module.exports = LannisportTreasury;
