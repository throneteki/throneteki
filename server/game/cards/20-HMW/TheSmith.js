import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class TheSmith extends PlotCard {
    // The Smith (20058)
    // Marshaling Action: Kneel an attachment to choose and kneel a location.
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel a location',
            phase: 'marshal',
            cost: ability.costs.kneel((card) => card.getType() === 'attachment'),
            target: {
                cardCondition: (card) =>
                    card.getType() === 'location' && card.location === 'play area' && !card.kneeled,
                gameAction: 'kneel'
            },
            message: '{player} uses {source} and kneels {costs.kneel} to kneel {target}',
            gameAction: GameActions.kneelCard((context) => ({ card: context.target }))
        });
    }
}

TheSmith.code = '20058';

export default TheSmith;
