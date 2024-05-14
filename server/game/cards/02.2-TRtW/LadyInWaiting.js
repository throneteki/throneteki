const DrawCard = require('../../drawcard.js');

class LadyInWaiting extends DrawCard {
    setupCardAbilities() {
        this.playAction({
            title: 'Marshal as dupe',
            condition: () => this.canMarshalAsDupe(),
            cannotBeCanceled: true,
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.hasTrait('Lady') &&
                    card.controller === this.controller &&
                    card.owner === this.controller
            },
            handler: (context) => {
                this.marshalAsDupe(context.target);
            }
        });
    }

    canMarshalAsDupe() {
        return (
            this.game.currentPhase === 'marshal' &&
            this.controller.canPutIntoPlay(this, 'marshal') &&
            this.controller.isCardInPlayableLocation(this, 'marshal') &&
            this.controller.anyCardsInPlay(
                (card) => card.getType() === 'character' && card.hasTrait('Lady')
            )
        );
    }

    marshalAsDupe(card) {
        this.controller.removeCardFromPile(this);
        card.addDuplicate(this);
        this.game.addMessage('{0} places {1} on {2} as a duplicate', this.controller, this, card);
        return true;
    }
}

LadyInWaiting.code = '02023';

module.exports = LadyInWaiting;
