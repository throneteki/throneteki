const DrawCard = require('../../drawcard.js');

class BendTheKnee extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Kneel Lord or Lady',
            condition: () => this.hasStandingKingCharacter(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    (card.hasTrait('Lord') || card.hasTrait('Lady'))
            },
            handler: (context) => {
                context.target.controller.kneelCard(context.target);
                this.game.addMessage(
                    '{0} plays {1} to kneel {2}',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }

    hasStandingKingCharacter() {
        return this.controller.anyCardsInPlay(
            (card) => !card.kneeled && card.hasTrait('King') && card.getType() === 'character'
        );
    }
}

BendTheKnee.code = '09026';

module.exports = BendTheKnee;
