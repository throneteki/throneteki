import DrawCard from '../../drawcard.js';
import RevealPlots from '../../gamesteps/revealplots.js';

class WheelsWithinWheels extends DrawCard {
    // Wheels Within Wheels (16006)
    // Action: Kneel a unique [lannister] character to choose and reveal a new plot card. (Max 1 per
    // round.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Reveal a new plot',
            cost: ability.costs.kneel({ unique: true, faction: 'lannister', type: 'character' }),
            target: {
                activePromptTitle: 'Select a plot',
                cardCondition: (card, context) => context.player.plotDeck.includes(card),
                cardType: 'plot'
            },
            message: {
                format: '{player} plays {source} and kneels {kneeledCard} to reveal {target}',
                args: { kneeledCard: (context) => context.costs.kneel }
            },
            handler: (context) => {
                context.player.selectedPlot = context.target;
                this.game.queueStep(new RevealPlots(this.game, [context.target]));
            },
            max: ability.limit.perRound(1)
        });
    }
}

WheelsWithinWheels.code = '16006';

export default WheelsWithinWheels;
