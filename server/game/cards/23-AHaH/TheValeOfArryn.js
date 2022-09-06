const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions/index.js');
const TextHelper = require('../../TextHelper');

class TheValeOfArryn extends DrawCard {
    setupCardAbilities(ability) {
        this.plotModifiers({
            initiative: -1
        });

        this.reaction({
            when: {                
                afterChallenge: event => event.challenge.winner === this.controller && this.controller.anyCardsInPlay({ trait: 'House Arryn', type: 'character', participating: true })
            },
            message: {
                format: '{player} uses {source} to draw {numberToDraw}',
                args: { numberToDraw: () => TextHelper.count(this.getNumberToDraw(), 'card') }
            },
            limit: ability.limit.perPhase(1),
            gameAction: GameActions.drawCards(context => ({ player: context.player, amount: this.getNumberToDraw() }))
        });
    }

    getNumberToDraw() {
        return this.kneeled ? 2 : 1;
    }
}

TheValeOfArryn.code = '23033';

module.exports = TheValeOfArryn;
