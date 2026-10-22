import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheNewGift extends DrawCard {
    // The New Gift (07017)
    // Limited.
    // Marshaling Action: Kneel a Steward character to gain 1 gold. (Limit twice per phase.)
    // Challenges Action: Kneel a Steward character to draw 1 card. (Limit twice per phase.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Gain 1 gold',
            phase: 'marshal',
            condition: (context) => context.source.controller.canGainGold(),
            limit: ability.limit.perPhase(2),
            cost: ability.costs.kneel(
                (card) => card.hasTrait('Steward') && card.getType() === 'character'
            ),
            message: '{player} uses {source} and kneels {costs.kneel} to gain 1 gold',
            gameAction: GameActions.gainGold((context) => ({ player: context.player, amount: 1 }))
        });

        this.action({
            title: 'Draw 1 card',
            phase: 'challenge',
            condition: (context) => context.source.controller.canDraw(),
            limit: ability.limit.perPhase(2),
            cost: ability.costs.kneel(
                (card) => card.hasTrait('Steward') && card.getType() === 'character'
            ),
            message: '{player} uses {source} and kneels {costs.kneel} to draw 1 card',
            gameAction: GameActions.drawCards((context) => ({ player: context.player, amount: 1 }))
        });
    }
}

TheNewGift.code = '07017';

export default TheNewGift;
