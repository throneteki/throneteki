const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class SerDavenLannister extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardPowerGained: event => event.card === this
            },
            message: '{player} uses {source} to discard 1 card at random from each opponents hand',
            gameAction: GameActions.simultaneously(context => 
                context.game.getOpponents(context.player).map(opponent => GameActions.discardAtRandom({ amount: 1, player: opponent }))
            ).then({
                condition: context => context.game.getOpponents(context.player).every(opponent => opponent.hand.length < context.player.hand.length),
                message: 'Then, {player} draws 1 card',
                gameAction: GameActions.drawCards(context => ({ amount: context.costs.discardPower, player: context.player }))
            })
            
        });
    }
}

SerDavenLannister.code = '24007';

module.exports = SerDavenLannister;
