const GameActions = require('../../GameActions');
const PlotCard = require('../../plotcard');

class BurningTheBooks extends PlotCard {
    setupCardAbilities(ability) {
        this.whenRevealed({
            target: {
                choosingPlayer: 'eachOpponent',
                ifAble: true,
                cardCondition: { type: 'attachment', not: { trait: 'The Seven' }, location: 'play area', controller: 'choosingPlayer' }
            },
            message: '{player} uses {source} to discard {target}',
            handler: context => {
                this.game.resolveGameAction(
                    GameActions.simultaneously(
                        context.targets.getTargets().map(card => GameActions.discardCard({ card, source: this }))
                    ).then(originalContext => ({
                        condition: () => this.hasValidTargets(originalContext.player),
                        cost: ability.costs.discardPower(1, card => card.getType() === 'character'),
                        message: 'Then, {player} discards 1 power from {costs.discardPower} to initiate the effect of {source} again',
                        handler: () => {
                            let newContext = originalContext.ability.createContext(originalContext.event);
                            this.game.resolveAbility(newContext.ability, newContext);
                        }
                    })),
                    context
                );
            }
        });
    }

    hasValidTargets(player) {
        return this.game.getOpponents(player).some(opponent => opponent.anyCardsInPlay(card => card.getType() === 'attachment'));
    }
}

BurningTheBooks.code = '25613';
BurningTheBooks.version = '1.1';

module.exports = BurningTheBooks;
