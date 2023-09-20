const GameActions = require('../../GameActions/index.js');
const DrawCard = require('../../drawcard.js');

class LittleBird extends DrawCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onCardOutOfShadows: event => event.card === this
            },
            message: '{player} uses {source} to draw 1 card',
            gameAction: GameActions.simultaneously(context =>
                // TODO: Add a 'decline message' to GameActions.may
                context.game.getPlayersInFirstPlayerOrder().map(player => GameActions.may({
                    player,
                    title: context => 'Draw 1 card from ' + context.source.name + '?',
                    message: '{choosingPlayer} draws 1 card',
                    gameAction: GameActions.drawCards(context => ({ player: context.choosingPlayer, amount: 1 }))
                }))
            )
        });
    }
}

LittleBird.code = '25602';
LittleBird.version = '1.1';

module.exports = LittleBird;
