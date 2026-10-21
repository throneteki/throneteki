import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import { Tokens } from '../../Constants/index.js';

class Meadowlark extends DrawCard {
    // Meadowlark (13076)
    // Reaction: After you reveal a plot card, place 1 journey token on Meadowlark.
    // Action: Sacrifice Meadowlark to search your deck for a character with printed cost X or lower
    // and put it into play. Shuffle your deck. X is the number of journey tokens on Meadowlark.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPlotRevealed: (event) => event.plot.controller === this.controller
            },
            message: '{player} uses {source} to place 1 journey token on {source}',
            gameAction: GameActions.placeToken({
                card: this,
                token: Tokens.journey
            })
        });

        this.action({
            title: 'Search the deck',
            cost: ability.costs.sacrificeSelf(),
            message: {
                format: '{player} sacrifices {costs.sacrifice} to search their deck for a character with printed cost {tokens} or lower',
                args: { tokens: (context) => this.numberOfJourneyTokens(context) }
            },
            gameAction: GameActions.search({
                title: 'Select a character',
                match: {
                    type: 'character',
                    condition: (card, context) =>
                        card.getPrintedCost() <= this.numberOfJourneyTokens(context)
                },
                reveal: false,
                message: '{player} {gameAction}',
                gameAction: GameActions.putIntoPlay((context) => ({
                    card: context.searchTarget
                }))
            })
        });
    }

    numberOfJourneyTokens(context) {
        return context.cardStateWhenInitiated.tokens[Tokens.journey] || 0;
    }
}

Meadowlark.code = '13076';

export default Meadowlark;
