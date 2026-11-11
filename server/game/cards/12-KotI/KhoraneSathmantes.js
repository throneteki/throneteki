import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

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
            message: {
                format: '{player} kneels {costs.kneel} to kneel {character} and {location}',
                args: {
                    character: (context) => context.targets.character,
                    location: (context) => context.targets.location
                }
            },
            gameAction: GameActions.simultaneously([
                GameActions.kneelCard((context) => ({ card: context.targets.character })),
                GameActions.kneelCard((context) => ({ card: context.targets.location }))
            ])
        });
    }
}

KhoraneSathmantes.code = '12025';

export default KhoraneSathmantes;
