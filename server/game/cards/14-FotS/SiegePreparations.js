import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class SiegePreparations extends PlotCard {
    // Siege Preparations (14048)
    // Dominance Action: Draw cards until your hand size is equal to your reserve value. (Limit once
    // per phase.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Draw cards',
            phase: 'dominance',
            condition: (context) =>
                context.source.controller.canDraw() &&
                context.source.controller.getReserve() > context.source.controller.getHandCount(),
            message:
                '{player} uses {source} to draw cards until their hand size equals their reserve',
            gameAction: GameActions.drawCards((context) => ({
                player: context.player,
                amount: context.player.getReserve() - context.player.getHandCount()
            })),
            limit: ability.limit.perPhase(1)
        });
    }
}

SiegePreparations.code = '14048';

export default SiegePreparations;
