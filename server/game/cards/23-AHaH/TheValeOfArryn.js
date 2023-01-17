const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions/index.js');

class TheValeOfArryn extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.isMatch({ winner: this.controller, by5: true })
            },
            target: {
                cardCondition: { type: 'character', participating: true, or: [{ loyal: true }, { trait: 'House Arryn' }], controller: 'current' },
                gameAction: 'gainPower'
            },
            message: {
                format: '{player} uses {source} to have {target} gain {numberOfPower} power',
                args: { numberOfPower: () => this.getNumberOfPower() }
            },
            limit: ability.limit.perPhase(1),
            handler: context => {
                this.game.resolveGameAction(
                    GameActions.gainPower(context => ({ card: context.target, amount: this.getNumberOfPower() }))
                    , context
                );
            }
        });
    }

    getNumberOfPower() {
        return this.kneeled ? 2 : 1;
    }
}

TheValeOfArryn.code = '23032';

module.exports = TheValeOfArryn;
