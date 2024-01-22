const GameActions = require('../../GameActions/index.js');
const PlotCard = require('../../plotcard.js');

class DanceOfTheDragons extends PlotCard {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onClaimApplied: event => event.challenge.isMatch({ attackingPlayer: this.controller, challengeType: ['military', 'intrigue'] }) && event.challenge.loser.faction.power > 0
            },
            cost: ability.costs.kneel(card => card.getType() === 'character' && card.hasTrait('Dragon')),
            message: {
                format: '{player} uses {source} and kneels {costs.kneel} to move {amount} power from {loser}\'s faction card to their own instead of the normal claim effects',
                args: { 
                    amount: context => Math.min(context.event.challenge.loser.faction.power, 2),
                    loser: context => context.event.challenge.loser
                }
            },
            handler: context => {
                context.replaceHandler(() => {
                    this.game.resolveGameAction(
                        GameActions.movePower(context => ({
                            from: context.event.challenge.loser.faction,
                            to: context.player.faction,
                            amount: 2
                        })),
                        context
                    );
                });
            }
        });
    }
}

DanceOfTheDragons.code = '25584';
DanceOfTheDragons.version = '1.0';

module.exports = DanceOfTheDragons;
