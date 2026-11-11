import range from 'lodash.range';
import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import { Tokens } from '../../Constants/index.js';

class TheHouseOfBlackAndWhite extends DrawCard {
    // The House of Black and White (08022)
    // Bestow (10).
    // Dominance Action: Kneel The House of Black and White and discard X gold from it to choose and
    // kill a character with printed STR X or lower (X cannot be 0). You may move any number of gold
    // from your gold pool to The House of Black and White.
    setupCardAbilities(ability) {
        this.action({
            title: 'Kill character',
            phase: 'dominance',
            cost: [
                ability.costs.kneelSelf(),
                ability.costs.discardXGold(
                    (context) => minimumDiscardGoldAmount(context),
                    () => 99
                )
            ],
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.getPrintedStrength() <=
                        (context.xValue || context.source.tokens[Tokens.gold] || 0)
            },
            message: {
                format: '{player} kneels and discards {amount} gold from {source} to kill {target}',
                args: { amount: (context) => context.xValue }
            },
            gameAction: GameActions.simultaneously([
                GameActions.kill((context) => ({ card: context.target })),
                GameActions.ifCondition({
                    condition: (context) => context.player.getSpendableGold() > 0,
                    thenAction: GameActions.choose({
                        title: (context) => `Select gold amount to move to ${context.source.name}`,
                        choices: (context) =>
                            Object.fromEntries(
                                range(1, context.player.getSpendableGold() + 1)
                                    .reverse()
                                    .map((amount) => [
                                        amount.toString(),
                                        {
                                            message: {
                                                format: '{player} moves {amount} gold to {source}',
                                                args: { amount: () => amount }
                                            },
                                            gameAction: GameActions.transferGold({
                                                from: context.player,
                                                to: context.source,
                                                amount
                                            })
                                        }
                                    ])
                            ),
                        cancelMessage: '{choosingPlayer} does not move gold to {source}'
                    })
                })
            ])
        });
    }
}

function minimumDiscardGoldAmount(context) {
    const strengths = context.game
        .filterCardsInPlay((card) => card.getType() === 'character')
        .map((card) => card.getPrintedStrength());
    return Math.max(Math.min(...strengths), 1);
}

TheHouseOfBlackAndWhite.code = '08022';

export default TheHouseOfBlackAndWhite;
