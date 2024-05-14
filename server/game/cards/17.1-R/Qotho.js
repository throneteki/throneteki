const DrawCard = require('../../drawcard.js');

class Qotho extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Put Qotho into play',
            location: 'hand',
            condition: () =>
                this.controller.canPutIntoPlay(this) && this.game.anyPlotHasTrait('Summer'),
            cost: ability.costs.discardMultipleFromHand(
                2,
                (card) => card !== this && card.isFaction('targaryen')
            ),
            handler: (context) => {
                this.controller.putIntoPlay(this);
                this.game.addMessage(
                    '{0} discards {1} to put {2} into play',
                    this.controller,
                    context.costs.discardFromHand,
                    this
                );
            }
        });
    }
}

Qotho.code = '17131';

module.exports = Qotho;
