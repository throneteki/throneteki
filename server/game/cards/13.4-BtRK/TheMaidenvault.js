import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheMaidenvault extends DrawCard {
    // The Maidenvault (13064)
    // Shadow (1).
    // Reaction: After The Maidenvault comes out of shadows, choose a participating Lady character.
    // Stand it and remove it from the challenge.
    // Interrupt: When the challenges phase ends, kneel The Maidenvault to return it to shadows.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardOutOfShadows: (event, context) => event.card === context.source
            },
            target: {
                cardCondition: (card) =>
                    card.getType() === 'character' &&
                    card.hasTrait('Lady') &&
                    card.isParticipating()
            },
            message: '{player} uses {source} to stand and remove {target} from the challenge',
            gameAction: GameActions.simultaneously([
                GameActions.standCard((context) => ({ card: context.target })),
                GameActions.removeFromChallenge((context) => ({ card: context.target }))
            ])
        });
        this.interrupt({
            when: {
                onPhaseEnded: (event) => event.phase === 'challenge'
            },
            cost: ability.costs.kneelSelf(),
            message: '{player} kneels {source} to return it to shadows',
            gameAction: GameActions.putIntoShadows((context) => ({ card: context.source }))
        });
    }
}

TheMaidenvault.code = '13064';

export default TheMaidenvault;
