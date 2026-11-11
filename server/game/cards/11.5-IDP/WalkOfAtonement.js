import DrawCard from '../../drawcard.js';
import TextHelper from '../../TextHelper.js';
import GameActions from '../../GameActions/index.js';

class WalkOfAtonement extends DrawCard {
    // Walk of Atonement (11090)
    // Dominance Action: Discard any amount of power from a character you control. For each power
    // discarded, discard 1 card at random from each opponent's hand and draw 1 card.
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard cards and draw',
            phase: 'dominance',
            cost: ability.costs.discardAnyPower((card) => card.getType() === 'character'),
            message: {
                format: '{player} plays {source} and discards {xValue} power from {costs.discardPower} to discard {cards} from each opponent and draw {cards}',
                args: {
                    xValue: (context) => context.xValue,
                    cards: (context) => TextHelper.count(context.xValue, 'card')
                }
            },
            gameAction: GameActions.simultaneously((context) => [
                ...context.game
                    .getOpponents(context.player)
                    .map((opponent) =>
                        GameActions.discardAtRandom({ player: opponent, amount: context.xValue })
                    ),
                GameActions.drawCards({ player: context.player, amount: context.xValue })
            ])
        });
    }
}

WalkOfAtonement.code = '11090';

export default WalkOfAtonement;
