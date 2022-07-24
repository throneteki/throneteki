const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions/index.js');

class TheValeOfArryn extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {                
                afterChallenge: event => event.challenge.winner === this.controller && this.controller.anyCardsInPlay({ trait: 'House Arryn', type: 'character', defending: true })
            },
            message: {
                format: '{player} uses {source} to draw {numberToDraw} cards',
                args: { numberToDraw: () => this.getNumberToDraw() }
            },
            gameAction: GameActions.drawCards(context => ({ player: context.player, amount: this.getNumberToDraw() }))
        });
    }

    getNumberToDraw() {
        return Math.min(this.controller.getNumberOfCardsInPlay({ trait: 'House Arryn', type: 'character', defending: true }), 5);
    }
}

TheValeOfArryn.code = '23033';

module.exports = TheValeOfArryn;
