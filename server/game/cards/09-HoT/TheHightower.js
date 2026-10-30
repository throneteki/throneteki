import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheHightower extends DrawCard {
    // The Hightower (09017)
    // Reaction: After a [tyrell] character enters play under your control, gain 1 gold and draw 1
    // card. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card.isFaction('tyrell') &&
                    event.card.getType() === 'character' &&
                    event.card.controller === context.player
            },
            limit: ability.limit.perPhase(1),
            message: '{player} uses {source} and {gameAction}',
            gameAction: GameActions.simultaneously([
                GameActions.gainGold((context) => ({ player: context.player, amount: 1 })),
                GameActions.drawCards((context) => ({ player: context.player, amount: 1 }))
            ])
        });
    }
}

TheHightower.code = '09017';

export default TheHightower;
