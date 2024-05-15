import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class DoubtingSepta extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.challengeType === 'intrigue' &&
                    event.challenge.winner === this.controller
            },
            cost: ability.costs.sacrificeSelf(),
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.player &&
                    (card.getType() === 'character' || card.getType() === 'location') &&
                    card.canGainPower()
            },
            message: '{player} sacrifices {source} to have {target} gain 1 power',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.gainPower({ card: context.target, amount: 1 }),
                    context
                );
            }
        });
    }
}

DoubtingSepta.code = '13069';

export default DoubtingSepta;
