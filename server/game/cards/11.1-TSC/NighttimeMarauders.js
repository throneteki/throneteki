import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class NighttimeMarauders extends DrawCard {
    // Nighttime Marauders (11012)
    // Pillage. Shadow (3).
    // Reaction: After Nighttime Marauders comes out of shadows, choose a card in an opponent's
    // discard pile. That player reveals his or her hand and discards from it each card with the
    // same printed cost as the chosen card.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardOutOfShadows: (event, context) => event.card === context.source
            },
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card, context) =>
                    card.controller !== context.player && card.location === 'discard pile'
            },
            message: {
                format: '{player} uses {source} to choose {target} and have {opponent} reveal their hand: {hand}',
                args: {
                    opponent: (context) => context.target.controller,
                    hand: (context) => context.target.controller.hand
                }
            },
            gameAction: GameActions.simultaneously((context) =>
                context.target.controller.hand
                    .filter(
                        (card) =>
                            card.hasPrintedCost() &&
                            card.getPrintedCost() === context.target.getPrintedCost()
                    )
                    .map((card) => GameActions.discardCard({ card, allowSave: false }))
            )
        });
    }
}

NighttimeMarauders.code = '11012';

export default NighttimeMarauders;
