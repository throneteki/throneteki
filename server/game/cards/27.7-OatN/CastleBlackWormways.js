import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class CastleBlackWormways extends DrawCard {
    setupCardAbilities() {
        this.plotModifiers({
            reserve: 1
        });
        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card === this
            },
            condition: () =>
                this.game.getPlayers().some((player) => player.activePlot.hasTrait('Winter')),
            target: {
                cardCondition: {
                    type: 'character',
                    location: 'play area',
                    controller: 'current'
                }
            },
            message: '{player} uses {source} to return {target} to shadows',
            handler: (context) => {
                this.game.resolveGameActions(
                    GameActions.putIntoShadows(context({ card: context.target })),
                    context
                );
            }
        });
    }
}

CastleBlackWormways.code = '27558';
CastleBlackWormways.version = '1.0.0';

export default CastleBlackWormways;
