const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions')

class TorrhensSquare extends DrawCard {
    setupCardAbilities(ability) {
        this.plotModifiers({
            initiative: -2
        });

        this.persistentEffect({
            match: card => card.name === 'Dagmer Cleftjaw' && card.controller === this.controller,
            effect: [
                ability.effects.modifyStrength(2),
                ability.effects.doesNotKneelAsDefender()
            ]
        });

        this.reaction({
            when: {
                onInitiativeDetermined: event => event.winner !== this.controller
            },
            message: {
                format: '{player} uses {source} to discard the top {amount} cards from each opponents deck',
                args: { amount: context => this.getNumberOfRaiders(context.player) }
            },
            gameAction: GameActions.simultaneously(context => 
                context.game.getOpponentsInFirstPlayerOrder(context.player).map(player => GameActions.discardTopCards({ player: player, amount: this.getNumberOfRaiders(context.player) }))
            )
        });
    }

    getNumberOfRaiders(player) {
        return player.filterCardsInPlay(card => card.hasTrait('Raider')).length;
    }
}

TorrhensSquare.code = '23004';

module.exports = TorrhensSquare;
