import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BeggarKing extends DrawCard {
    // Beggar King (04034)
    // [targaryen] character only.
    // Attached character gains the King trait.
    // Reaction: After an opponent reveals a plot card with a higher printed gold value than yours,
    // kneel Beggar King to gain 1 gold. (2 gold instead if no opponent controls a King character.)
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'targaryen' });
        this.whileAttached({
            effect: ability.effects.addTrait('King')
        });
        this.reaction({
            when: {
                onPlotsRevealed: (event, context) =>
                    event.plots.some(
                        (plot) =>
                            plot.controller !== context.player &&
                            context.player.activePlot.income.printedValue < plot.income.printedValue
                    )
            },
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {source} to gain {gold} gold',
                args: { gold: (context) => beggarGold(context) }
            },
            gameAction: GameActions.gainGold((context) => ({
                player: context.player,
                amount: beggarGold(context)
            }))
        });
    }
}

function beggarGold(context) {
    const opponentHasKing = context.game.anyCardsInPlay(
        (card) =>
            card.controller !== context.player &&
            card.getType() === 'character' &&
            card.hasTrait('King')
    );
    return opponentHasKing ? 1 : 2;
}

BeggarKing.code = '04034';

export default BeggarKing;
