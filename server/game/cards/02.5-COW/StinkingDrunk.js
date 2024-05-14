const DrawCard = require('../../drawcard.js');

class StinkingDrunk extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ controller: 'opponent' });
        this.reaction({
            when: {
                onCardStood: (event) => event.card === this.parent
            },
            cost: ability.costs.sacrificeSelf(),
            handler: (context) => {
                this.game.addMessage(
                    '{0} sacrifices {1} to kneel {2}',
                    context.player,
                    this,
                    context.event.card
                );
                context.event.card.controller.kneelCard(context.event.card);
            }
        });
    }
}

StinkingDrunk.code = '02088';

module.exports = StinkingDrunk;
