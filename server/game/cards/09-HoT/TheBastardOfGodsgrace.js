const DrawCard = require('../../drawcard.js');

class TheBastardOfGodsgrace extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Reduce play / ambush cost by 2',
            phase: 'challenge',
            cost: ability.costs.discardPowerFromSelf(),
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    effect: ability.effects.reduceNextAmbushedOrPlayedCardCost(2)
                }));

                this.game.addMessage(
                    '{0} discards a power from {1} to reduce the cost of the next card played or ambushed this phase by 2',
                    context.player,
                    this
                );
            }
        });
    }
}

TheBastardOfGodsgrace.code = '09031';

module.exports = TheBastardOfGodsgrace;
