const _ = require('underscore');

const DrawCard = require('../../drawcard.js');

class KingsBlood extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: ['Bastard', 'King'], controller: 'current' });
        this.action({
            title: 'Discard power from opponent\'s faction',
            condition: () => this.hasToken('gold'),
            phase: 'plot',
            cost: [
                ability.costs.kneelParent(),
                ability.costs.sacrificeSelf()
            ],
            handler: context => {
                let gold = context.cardStateWhenInitiated.tokens.gold;

                _.each(this.game.getOpponents(context.player), player => {
                    this.game.addPower(player, -gold);
                });

                this.game.addMessage('{0} kneels {1} and sacrifices {2} to discard {3} power from each opponent\'s faction card',
                    context.player, context.cardStateWhenInitiated.parent, this, gold);
            }
        });
    }
}

KingsBlood.code = '06108';

module.exports = KingsBlood;
