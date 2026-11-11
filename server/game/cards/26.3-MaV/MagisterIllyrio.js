import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MagisterIllyrio extends DrawCard {
    // Magister Illyrio (26053)
    // Insight. Shadow (5).
    // Reaction: After the challenges phase begins, gain 1 gold for every 2 cards in shadows.
    // +1 Income.
    setupCardAbilities() {
        this.plotModifiers({
            gold: 1
        });
        const numOfShadowCards = (context) =>
            context.game.allCards.reduce(
                (count, card) => (card.location === 'shadows' ? count + 1 : count),
                0
            );
        const amountToGain = (context) => Math.floor(numOfShadowCards(context) / 2);

        this.reaction({
            when: {
                onPhaseStarted: (event) => event.phase === 'challenge'
            },
            message: {
                format: '{player} uses {source} to gain {amountToGain} gold',
                args: { amountToGain }
            },
            gameAction: GameActions.gainGold((context) => ({
                player: context.player,
                amount: amountToGain(context)
            }))
        });
    }
}

MagisterIllyrio.code = '26053';

export default MagisterIllyrio;
