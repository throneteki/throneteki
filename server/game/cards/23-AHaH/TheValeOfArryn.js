const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions/index.js');

class TheValeOfArryn extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.isMatch({ winner: this.controller, by5: true }) && this.controller.anyCardsInPlay({ trait: 'House Arryn', type: 'character', participating: true })
            },
            target: {
                cardCondition: { type: 'character', participating: true, trait: 'House Arryn' },
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

TheValeOfArryn.code = '23033';

module.exports = TheValeOfArryn;
