import DrawCard from '../../drawcard.js';

class WestwatchByTheBridge extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand location',
            cost: ability.costs.kneelSelf(),
            target: {
                activePromptTitle: 'Select a location',
                cardCondition: (card) =>
                    card !== this &&
                    card.isFaction('thenightswatch') &&
                    card.getType() === 'location' &&
                    card.kneeled &&
                    card.getPrintedCost() <= this.getTargetPrintedCost(),
                gameAction: 'stand'
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} kneels {1} to stand {2}',
                    context.player,
                    this,
                    context.target
                );
                context.player.standCard(context.target);
            }
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
