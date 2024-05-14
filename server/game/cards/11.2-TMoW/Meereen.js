const DrawCard = require('../../drawcard.js');
const TextHelper = require('../../TextHelper');

class Meereen extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Place hand facedown and draw 3',
            cost: ability.costs.kneelSelf(),
            handler: (context) => {
                this.lastingEffect((ability) => ({
                    until: {
                        onCardLeftPlay: (event) => event.card === this,
                        onPhaseEnded: () => true
                    },
                    effect: ability.effects.removeCardsFromHand()
                }));

                let numDrawn = context.player.drawCardsToHand(3).length;
                this.game.addMessage(
                    '{0} kneels {1} to place their hand facedown under {1} and draw {2}',
                    context.player,
                    this,
                    TextHelper.count(numDrawn, 'card')
                );
            }
        });
    }
}

Meereen.code = '11034';

module.exports = Meereen;
