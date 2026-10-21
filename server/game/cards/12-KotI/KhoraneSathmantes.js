import DrawCard from '../../drawcard.js';

class KhoraneSathmantes extends DrawCard {
    // Khorane Sathmantes (12025)
    // Action: Kneel Khorane Sathmantes and a Warship location to choose and kneel 1 character and 1
    // location.
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel character and location',
            cost: [
                ability.costs.kneelSelf(),
                ability.costs.kneel(
                    (card) => card.getType() === 'location' && card.hasTrait('Warship')
                )
            ],
            targets: {
                character: {
                    cardCondition: (card) =>
                        card.location === 'play area' &&
                        card.getType() === 'character' &&
                        !card.kneeled,
                    gameAction: 'kneel'
                },
                location: {
                    activePromptTitle: 'Select a location',
                    cardCondition: (card) =>
                        card.location === 'play area' &&
                        card.getType() === 'location' &&
                        !card.kneeled,
                    gameAction: 'kneel'
                }
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} kneels {1} to kneel {2} and {3}',
                    context.player,
                    context.costs.kneel,
                    context.targets.character,
                    context.targets.location
                );
                context.targets.character.controller.kneelCard(context.targets.character);
                context.targets.location.controller.kneelCard(context.targets.location);
            }
        });
    }
}

KhoraneSathmantes.code = '12025';

export default KhoraneSathmantes;
