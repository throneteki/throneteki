const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class HeadsOnPikes extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard cards',
            phase: 'dominance',
            message:
                '{player} plays {source} to have each opponent discard cards from the top of their deck',
            gameAction: GameActions.simultaneously((context) =>
                this.game.getOpponents(context.player).map((opponent) =>
                    GameActions.discardTopCards({
                        player: opponent,
                        amount: opponent.deadPile.length * 2,
                        source: context.source
                    }).thenExecute((event) => {
                        this.game.addMessage('{player} discards {topCards}', event);
                    })
                )
            ),
            max: ability.limit.perRound(1)
        });
    }
}

HeadsOnPikes.code = '16023';

module.exports = HeadsOnPikes;
