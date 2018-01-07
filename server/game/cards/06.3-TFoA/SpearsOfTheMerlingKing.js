const DrawCard = require('../../drawcard.js');

class SpearsOfTheMerlingKing extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            title: context => context.event.card.name,
            when: {
                onCharacterKilled: event => event.card.controller === this.controller
            },
            cost: ability.costs.sacrificeSelf(),
            handler: context => {
                this.game.addMessage('{0} sacrifices {1} to return {2} to their hand',
                    this.controller, this, context.event.card);
                context.replaceHandler(() => {
                    context.event.cardStateWhenKilled = context.event.card.createSnapshot();
                    this.controller.moveCard(context.event.card, 'hand');
                });
            }
        });
    }
}

SpearsOfTheMerlingKing.code = '06048';

module.exports = SpearsOfTheMerlingKing;
