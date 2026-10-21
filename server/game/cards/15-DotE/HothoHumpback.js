import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class HothoHumpback extends DrawCard {
    // Hotho Humpback (15027)
    // Challenges Action: Each player draws 1 card. Each player checks reserve. (Limit once per
    // round.)
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
