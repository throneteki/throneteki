import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class OfferOfAPeach extends DrawCard {
    // Offer of a Peach (04084)
    // Play only if you control Renly Baratheon or a Lady character.
    // Challenges Action: Choose an attacking character. Stand that character and remove it from the
    // challenge.
    setupCardAbilities() {
        this.action({
            title: 'Remove character from challenge',
            condition: (context) =>
                context.source.controller.anyCardsInPlay(
                    (card) => card.hasTrait('Lady') || card.name === 'Renly Baratheon'
                ),
            phase: 'challenge',
            target: {
                cardCondition: (card, context) => context.source.cardCondition(card)
            },
            message: '{player} uses {source} to stand {target} and remove them from the challenge',
            gameAction: GameActions.simultaneously([
                GameActions.standCard((context) => ({ card: context.target })),
                GameActions.removeFromChallenge((context) => ({ card: context.target }))
            ])
        });
    }

    cardCondition(card) {
        return card.location === 'play area' && card.isAttacking();
    }
}

OfferOfAPeach.code = '04084';

export default OfferOfAPeach;
