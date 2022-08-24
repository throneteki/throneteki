const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class TorrhensSquare extends DrawCard {
    setupCardAbilities(ability) {
        this.plotModifiers({
            initiative: -2
        });
        this.reaction({
            when: {
                onCardOutOfShadows: event => event.card.controller === this.controller && event.card.isFaction('greyjoy')
            },
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {source} to discard the top {amount} cards from {opponents} deck',
                args: { 
                    amount: context => this.getNumberOfRaiders(context.player),
                    opponents: context => this.getOpponentsToDiscard(context)
                }
            },
            gameAction: GameActions.simultaneously(context => 
                this.getOpponentsToDiscard(context).map(player => GameActions.discardTopCards({ player: player, amount: this.getNumberOfRaiders(context.player) }))
            )
        });
    }
    getOpponentsToDiscard(context) {
        return context.game.getOpponentsInFirstPlayerOrder(context.player).filter(player => player.getTotalInitiative() >= context.player.getTotalInitiative());
    }
    getNumberOfRaiders(player) {
        return Math.min(player.getNumberOfCardsInPlay({ type: 'character', trait: 'Raider' }), 3);
    }
}

TorrhensSquare.code = '23004';

module.exports = TorrhensSquare;
