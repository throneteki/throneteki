import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class HothoHumpback extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Draw card and check reserve',
            phase: 'challenge',
            message: '{player} uses {source} to have each player draw a card and check for reserve',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.simultaneously(() => [
                        ...this.game
                            .getPlayersInFirstPlayerOrder()
                            .map((player) => GameActions.drawCards({ player, amount: 1 }))
                    ]),
                    context
                );
                this.game.resolveGameAction(GameActions.checkReserve(), context);
            },
            limit: ability.limit.perRound(1)
        });
    }
}

HothoHumpback.code = '15027';

export default HothoHumpback;
