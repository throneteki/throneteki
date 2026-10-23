import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class PrinceOfTheNarrowSea extends DrawCard {
    // Prince of the Narrow Sea (23002)
    // Unique [baratheon] character only.
    // If attached character is Salladhor Saan, he gains the Commander trait and renown.
    // Reaction: After you lose initiative, return a Captain or Smuggler character to your hand to
    // choose and kneel 1 character and 1 location, each with lower printed cost.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'baratheon', unique: true });
        this.whileAttached({
            match: (card) => card.name === 'Salladhor Saan',
            effect: [ability.effects.addTrait('Commander'), ability.effects.addKeyword('Renown')]
        });
        this.reaction({
            when: {
                onInitiativeDetermined: (event, context) => event.winner !== context.player
            },
            cost: ability.costs.returnToHand((card) =>
                card.isMatch({ trait: ['Captain', 'Smuggler'], type: 'character' })
            ),
            targets: {
                character: {
                    activePromptTitle: 'Select a character',
                    cardCondition: {
                        type: 'character',
                        location: 'play area',
                        condition: (card, context) =>
                            !context.costs.returnToHand ||
                            card.getPrintedCost() < context.costs.returnToHand.getPrintedCost()
                    }
                },
                location: {
                    activePromptTitle: 'Select a location',
                    cardCondition: {
                        type: 'location',
                        location: 'play area',
                        condition: (card, context) =>
                            !context.costs.returnToHand ||
                            card.getPrintedCost() < context.costs.returnToHand.getPrintedCost()
                    }
                }
            },
            message: {
                format: '{player} uses {source} and returns {costs.returnToHand} to its owners hand to kneel {knelt}',
                args: { knelt: (context) => context.targets.getTargets() }
            },
            gameAction: GameActions.simultaneously((context) =>
                context.targets.getTargets().map((card) => GameActions.kneelCard({ card }))
            )
        });
    }
}

PrinceOfTheNarrowSea.code = '23002';

export default PrinceOfTheNarrowSea;
