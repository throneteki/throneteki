import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class AllMenAreFools extends DrawCard {
    // All Men Are Fools (17140)
    // Reaction: After you win a challenge by 5 or more STR, choose up to 5 Lady characters. Each
    // chosen character gains 1 power. (Max 1 per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            max: ability.limit.perPhase(1),
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player &&
                    event.challenge.strengthDifference >= 5
            },
            target: {
                mode: 'upTo',
                numCards: 5,
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.hasTrait('Lady'),
                gameAction: 'gainPower'
            },
            message: '{player} plays {source} to have {target} each gain 1 power',
            gameAction: GameActions.simultaneously((context) =>
                context.target.map((card) => GameActions.gainPower({ card, amount: 1 }))
            )
        });
    }
}

AllMenAreFools.code = '17140';

export default AllMenAreFools;
