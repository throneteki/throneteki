const GameActions = require('../../GameActions/index.js');
const DrawCard = require('../../drawcard.js');

class TyeneSand extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onDominanceDetermined: event => event.winner && this.controller !== event.winner
            },
            target: {
                cardCondition: { location: 'play area', type: 'character', controller: 'current', condition: (card, context) => GameActions.movePower({ from: context.event.winner.faction, to: card, amount: 1 }).allow() }
            },
            message: {
                format: '{player} uses {source} to move 1 power from {winner}\'s faction card to {target}',
                args: { winner: context => context.event.winner }
            },
            handler: context => {
                context.game.resolveGameAction(GameActions.movePower(context => ({ from: context.event.winner.faction, to: context.target, amount: 1 })), context);
            }
        });
    }
}

TyeneSand.code = '25539';
TyeneSand.version = '1.0';

module.exports = TyeneSand;
