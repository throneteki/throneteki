const DrawCard = require('../../drawcard.js');
const { Tokens } = require('../../Constants');

class KingsBlood extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: ['Bastard', 'King'], controller: 'current' });
        this.action({
            title: "Discard power from opponent's faction",
            condition: () => this.hasToken(Tokens.gold),
            phase: 'plot',
            cost: [ability.costs.kneelParent(), ability.costs.sacrificeSelf()],
            handler: (context) => {
                let gold = context.cardStateWhenInitiated.tokens.gold;

                for (let player of this.game.getOpponents(context.player)) {
                    this.game.addPower(player, -gold);
                }

                this.game.addMessage(
                    "{0} kneels {1} and sacrifices {2} to discard {3} power from each opponent's faction card",
                    context.player,
                    context.cardStateWhenInitiated.parent,
                    this,
                    gold
                );
            }
        });
    }
}

KingsBlood.code = '06108';

module.exports = KingsBlood;
