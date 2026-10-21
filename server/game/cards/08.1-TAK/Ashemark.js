import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';
import GameActions from '../../GameActions/index.js';

class Ashemark extends DrawCard {
    // Ashemark (08011)
    // Bestow (3).
    // Reaction: After a phase begins, kneel and sacrifice Ashemark to return each character with
    // printed cost X or lower to its owner's hand. X is the number of gold on Ashemark.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPhaseStarted: (event, context) => context.source.hasToken(Tokens.gold)
            },
            cost: [ability.costs.kneelSelf(), ability.costs.sacrificeSelf()],
            message: {
                format: "{player} kneels and sacrifices {costs.kneel} to return each character with printed cost {gold} or less to its owner's hand",
                args: { gold: (context) => context.cardStateWhenInitiated.tokens.gold }
            },
            gameAction: GameActions.simultaneously((context) =>
                context.game
                    .filterCardsInPlay((card) =>
                        card.isMatch({
                            type: 'character',
                            printedCostOrLower: context.cardStateWhenInitiated.tokens.gold
                        })
                    )
                    .map((card) => GameActions.returnCardToHand({ card }))
            )
        });
    }
}

Ashemark.code = '08011';

export default Ashemark;
