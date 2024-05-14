const DrawCard = require('../../drawcard');
const TextHelper = require('../../TextHelper');

class TheInnAtTheCrossroads extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Draw 3 cards',
            phase: 'dominance',
            cost: ability.costs.kneelSelf(),
            chooseOpponent: true,
            handler: (context) => {
                let numCardsDrawn = context.player.drawCardsToHand(3).length;
                this.game.takeControl(context.opponent, this);
                this.game.addMessage(
                    '{0} kneels {1} to draw {2} and give control of {1} to {3}',
                    context.player,
                    this,
                    TextHelper.count(numCardsDrawn, 'card'),
                    context.opponent
                );
            }
        });
    }
}

TheInnAtTheCrossroads.code = '11098';

module.exports = TheInnAtTheCrossroads;
