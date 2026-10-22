import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class WestwatchByTheBridge extends DrawCard {
    // Westwatch-by-the-Bridge (12032)
    // Action: Kneel Westwatch-by-the-Bridge to choose and stand another [thenightswatch] location
    // with printed cost 1 or lower. (Printed cost 4 or lower instead if you control a Ranger
    // character, a Steward character, and a Builder character.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand location',
            cost: ability.costs.kneelSelf(),
            target: {
                activePromptTitle: 'Select a location',
                cardCondition: (card, context) =>
                    card !== context.source &&
                    card.isFaction('thenightswatch') &&
                    card.getType() === 'location' &&
                    card.kneeled &&
                    card.getPrintedCost() <= context.source.getTargetPrintedCost(),
                gameAction: 'stand'
            },
            message: '{player} kneels {source} to stand {target}',
            gameAction: GameActions.standCard((context) => ({ card: context.target }))
        });
    }

    getTargetPrintedCost() {
        const traits = ['Ranger', 'Steward', 'Builder'];

        if (traits.every((trait) => this.controlsCharacterWithTrait(trait))) {
            return 4;
        }

        return 1;
    }

    controlsCharacterWithTrait(trait) {
        return this.controller.anyCardsInPlay(
            (card) => card.getType() === 'character' && card.hasTrait(trait)
        );
    }
}

WestwatchByTheBridge.code = '12032';

export default WestwatchByTheBridge;
