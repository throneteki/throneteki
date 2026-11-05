import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BendTheKnee extends DrawCard {
    // Bend the Knee (09026)
    // Play only if you control a standing King character.
    // Action: Choose and kneel a Lord or Lady character.
    setupCardAbilities() {
        this.action({
            title: 'Kneel Lord or Lady',
            condition: (context) => context.source.hasStandingKingCharacter(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    (card.hasTrait('Lord') || card.hasTrait('Lady'))
            },
            message: '{player} plays {source} to kneel {target}',
            gameAction: GameActions.kneelCard((context) => ({ card: context.target }))
        });
    }

    hasStandingKingCharacter() {
        return this.controller.anyCardsInPlay(
            (card) => !card.kneeled && card.hasTrait('King') && card.getType() === 'character'
        );
    }
}

BendTheKnee.code = '09026';

export default BendTheKnee;
