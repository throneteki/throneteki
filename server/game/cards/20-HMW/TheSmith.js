import PlotCard from '../../plotcard.js';

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
            handler: (context) => {
                context.target.controller.kneelCard(context.target);

                this.game.addMessage(
                    '{0} uses {1} and kneels {2} to kneel {3}',
                    context.player,
                    this,
                    context.costs.kneel,
                    context.target
                );
            }
        });
    }
}

TheSmith.code = '20058';

export default TheSmith;
