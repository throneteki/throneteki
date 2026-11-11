import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheValeOfArryn extends DrawCard {
    // The Vale of Arryn (23032)
    // Reaction: After you win a challenge by 5 or more STR, choose a participating loyal or House
    // Arryn character you control and have it gain 1 power. (2 power instead if The Vale of Arryn
    // is kneeling.) (Limit once per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.isMatch({ winner: context.source.controller, by5: true })
            },
            target: {
                cardCondition: {
                    type: 'character',
                    participating: true,
                    or: [{ loyal: true }, { trait: 'House Arryn' }],
                    controller: 'current'
                },
                gameAction: 'gainPower'
            },
            message: {
                format: '{player} uses {source} to have {target} gain {numberOfPower} power',
                args: { numberOfPower: (context) => context.source.getNumberOfPower() }
            },
            limit: ability.limit.perPhase(1),
            gameAction: GameActions.gainPower((context) => ({
                card: context.target,
                amount: context.source.getNumberOfPower()
            }))
        });
    }

    getNumberOfPower() {
        return this.kneeled ? 2 : 1;
    }
}

TheValeOfArryn.code = '23032';

export default TheValeOfArryn;
