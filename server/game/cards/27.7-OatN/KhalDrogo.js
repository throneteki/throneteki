import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class KhalDrogo extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.attackingPlayer === this.controller &&
                    event.challenge.strengthDifference >= 5
            },
            target: {
                type: 'select',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    (card.hasTrait('Army') || card.hasTrait('Dothraki'))
            },
            limit: ability.limit.perPhase(2),
            message: '{player} uses {source} to stand {target}',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.standCard((context) => ({ card: context.target })),
                    context
                );
            }
        });
    }
}

KhalDrogo.code = '27573';
KhalDrogo.version = '1.0.0';

export default KhalDrogo;
