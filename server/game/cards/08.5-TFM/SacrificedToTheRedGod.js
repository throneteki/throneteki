const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class SacrificedToTheRedGod extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Search for a character',
            phase: 'marshal',
            cost: ability.costs.sacrifice((card) => card.getType() === 'character'),
            condition: () =>
                this.controller.anyCardsInPlay(
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

module.exports = SacrificedToTheRedGod;
