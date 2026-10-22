import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SchemingSepton extends DrawCard {
    // Scheming Septon (11004)
    // Shadow (2).
    // Challenges Action: Draw 1 card and gain 2 gold. Then, place Scheming Septon on top of your
    // deck. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Draw 1 card and gain 2 gold',
            phase: 'challenge',
            limit: ability.limit.perPhase(1),
            message: '{player} uses {source} to {gameAction}',
            gameAction: GameActions.simultaneously([
                GameActions.drawCards((context) => ({ player: context.player, amount: 1 })),
                GameActions.gainGold((context) => ({ player: context.player, amount: 2 }))
            ]).then({
                message: 'Then {player} places {source} on top of their deck',
                gameAction: GameActions.returnCardToDeck((context) => ({ card: context.source }))
            })
        });
    }
}

SchemingSepton.code = '11004';

export default SchemingSepton;
