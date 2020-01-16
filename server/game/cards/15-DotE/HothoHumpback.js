const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class HothoHumpback extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Draw card and check reserve',
            phase: 'challenge',
            message: '{player} uses {source} to have each player draw a card and check for reserve',
            gameAction: GameActions.simultaneously(() => [
                ...this.game.getPlayersInFirstPlayerOrder().map(player =>
                    GameActions.drawCards({ player, amount: 1 })
                ),
                GameActions.checkReserve()
            ]),
            limit: ability.limit.perRound(1)
        });
    }
}

HothoHumpback.code = '15027';

module.exports = HothoHumpback;
