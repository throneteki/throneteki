import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Jhiqui extends DrawCard {
    // Jhiqui (08053)
    // Reaction: After you win a challenge, discard 1 card from your hand to have a participating
    // Lord or Lady character gain 1 power.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller
            },
            cost: ability.costs.discardFromHand(),
            target: {
                type: 'select',
                gameAction: 'gainPower',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isParticipating() &&
                    (card.hasTrait('Lord') || card.hasTrait('Lady'))
            },
            message:
                '{player} uses {source} and discards {costs.discardFromHand} to have {target} gain 1 power',
            gameAction: GameActions.gainPower((context) => ({ card: context.target, amount: 1 }))
        });
    }
}

Jhiqui.code = '08053';

export default Jhiqui;
