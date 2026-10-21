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
                onCardOutOfShadows: (event) => event.card === this
            },
            target: {
                cardCondition: (card) =>
                    card.getType() === 'character' &&
                    card.hasTrait('Lady') &&
                    card.isParticipating()
            },
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.standCard(() => ({ card: context.target })),
                    context
                );
                this.game.currentChallenge.removeFromChallenge(context.target);
                this.game.addMessage(
                    '{0} uses {1} to stand and remove {2} from the challenge',
                    context.player,
                    this,
                    context.target
                );
            }
        });
        this.interrupt({
            when: {
                onPhaseEnded: (event) => event.phase === 'challenge'
            },
            cost: ability.costs.kneelSelf(),
            handler: (context) => {
                context.player.putIntoShadows(this, false);
                this.game.addMessage(
                    '{0} kneels {1} to return it to shadows.',
                    context.player,
                    this
                );
            }
        });
    }
}

TheMaidenvault.code = '13064';

export default TheMaidenvault;
