const PlotCard = require('../../plotcard');
const GameActions = require('../../GameActions');

class TheLateLordFrey extends PlotCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onChallengeInitiated: (event) => event.challenge.attackingPlayer === this.controller
            },
            target: {
                type: 'select',
                cardCondition: (card, context) =>
                    card.hasTrait('House Frey') &&
                    card.controller === context.player &&
                    ['hand', 'discard pile'].includes(card.location) &&
                    context.player.canPutIntoPlay(card)
            },
            message: {
                format: '{player} uses {source} to put {target} into play from their {originalLocation}',
                args: { originalLocation: (context) => context.target.location }
            },
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.putIntoPlay((context) => ({
                        player: context.player,
                        card: context.target
                    })),
                    context
                );
            }
        });
    }
}

TheLateLordFrey.code = '20055';

module.exports = TheLateLordFrey;
