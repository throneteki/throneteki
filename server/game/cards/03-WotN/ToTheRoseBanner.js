import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ToTheRoseBanner extends DrawCard {
    // To the Rose Banner! (03038)
    // Marshaling Action: Choose a [tyrell] character you control. Gain X gold, where X is that
    // character's STR. Then, sacrifice that character.
    setupCardAbilities() {
        this.action({
            title: 'Gain gold then sacrifice character',
            phase: 'marshal',
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.player &&
                    card.isFaction('tyrell') &&
                    card.getType() === 'character'
            },
            message: {
                format: '{player} plays {source} to gain {amount} gold',
                args: { amount: (context) => context.target.getStrength() }
            },
            gameAction: GameActions.gainGold((context) => ({
                player: context.player,
                amount: context.target.getStrength()
            })).then({
                message: 'Then {player} sacrifices {target}',
                gameAction: GameActions.sacrificeCard((context) => ({ card: context.target }))
            })
        });
    }
}

ToTheRoseBanner.code = '03038';

export default ToTheRoseBanner;
