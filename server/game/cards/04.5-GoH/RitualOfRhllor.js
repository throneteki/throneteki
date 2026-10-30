import DrawCard from '../../drawcard.js';
import TextHelper from '../../TextHelper.js';
import GameActions from '../../GameActions/index.js';

class RitualOfRhllor extends DrawCard {
    // Ritual of R'hllor (04088)
    // Reaction: After you win dominance, choose X standing R'hllor characters. Each of those
    // characters gains 1 power.
    setupCardAbilities() {
        this.xValue({
            min: () => 1,
            max: (context) => standingRhllor(context.player).length
        });
        this.reaction({
            when: {
                onDominanceDetermined: (event, context) =>
                    context.player === event.winner && standingRhllor(context.player).length >= 1
            },
            message:
                "{player} plays {source} and pays {costs.gold} gold to have R'hllor characters gain 1 power",
            gameAction: GameActions.chooseCards({
                mode: 'exactly',
                numCards: (context) => context.xValue,
                title: (context) => `Select ${TextHelper.count(context.xValue, 'character')}`,
                cardCondition: (card, context) => standingRhllor(context.player).includes(card),
                gameAction: (card) => GameActions.gainPower({ card, amount: 1 })
            })
        });
    }
}

function standingRhllor(player) {
    return player.filterCardsInPlay(
        (card) => card.getType() === 'character' && card.hasTrait("R'hllor") && !card.kneeled
    );
}

RitualOfRhllor.code = '04088';

export default RitualOfRhllor;
