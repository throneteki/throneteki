import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SacrificedToTheRedGod extends DrawCard {
    // Sacrificed to the Red God (08088)
    // Play only if you control a R'hllor character.
    // Marshaling Action: Sacrifice a character to search your deck for a R'hllor character with
    // equal or lower printed cost and add it to your hand. Shuffle your deck.
    setupCardAbilities(ability) {
        this.action({
            title: 'Search for a character',
            phase: 'marshal',
            cost: ability.costs.sacrifice((card) => card.getType() === 'character'),
            condition: (context) =>
                context.source.controller.anyCardsInPlay(
                    (card) => card.hasTrait("R'hllor") && card.getType() === 'character'
                ),
            gameAction: GameActions.search({
                title: 'Select a character',
                match: {
                    type: 'character',
                    trait: "R'hllor",
                    condition: (card, context) =>
                        card.hasPrintedCost() &&
                        card.getPrintedCost() <= context.costs.sacrifice.getPrintedCost()
                },
                message: '{player} {gameAction}',
                gameAction: GameActions.addToHand((context) => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

SacrificedToTheRedGod.code = '08088';

export default SacrificedToTheRedGod;
