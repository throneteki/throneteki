const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class MutineerFromCrastersKeep extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: event => event.card === this
            },
            target: {
                title: 'Select a duplicate',
                cardCondition: card => card.location === 'duplicate'
            },
            message: {
                format: '{player} uses {source} to discard a duplicate on {duplicateParent}',
                args: { duplicateParent: context => context.target.parent }
            },
            handler: context => {
                this.game.resolveGameAction(GameActions.discardCard({ card: context.target }), context);
            }
        });
    }
}

MutineerFromCrastersKeep.code = '23009';

module.exports = MutineerFromCrastersKeep;
