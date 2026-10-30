import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ZolloTheFat extends DrawCard {
    // Zollo the Fat (22025)
    // Reaction: After an opponent gains gold, if it is not the marshaling phase, sacrifice Zollo
    // the Fat to move all gold from that player's gold pool to your own.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onGoldGained: (event, context) =>
                    event.player !== context.player && context.game.currentPhase !== 'marshal'
            },
            cost: ability.costs.sacrificeSelf(),
            message: {
                format: "{player} sacrifices {source} to move all gold from {opponent}'s gold pool to their own",
                args: { opponent: (context) => context.event.player }
            },
            gameAction: GameActions.transferGold((context) => ({
                from: context.event.player,
                to: context.player,
                amount: context.event.player.gold
            }))
        });
    }
}

ZolloTheFat.code = '22025';

export default ZolloTheFat;
