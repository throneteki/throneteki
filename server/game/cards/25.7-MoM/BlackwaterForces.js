const GameActions = require('../../GameActions/index.js');
const DrawCard = require('../../drawcard.js');

class BlackwaterForces extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                'onCardRevealed:aggregate': event => (
                    event.events.some(revealEvent => ['hand', 'draw deck'].includes(revealEvent.cardStateWhenRevealed.location))
                )
            },
            message: '{player} uses {source} to return {source} to its owner\'s hand',
            gameAction: GameActions.returnCardToHand({ card: this })
        });
    }
}

BlackwaterForces.code = '25589';
BlackwaterForces.version = '1.1';

module.exports = BlackwaterForces;
