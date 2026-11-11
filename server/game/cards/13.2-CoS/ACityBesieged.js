import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

function maxLocations(context) {
    return context.player.getNumberOfUsedPlotsByTrait('City') > 0 ? 2 : 1;
}

class ACityBesieged extends PlotCard {
    // A City Besieged (13040)
    // When Revealed: Choose and kneel a location. (Up to 2 locations instead if there is a City
    // plot card in your used pile.)
    setupCardAbilities() {
        this.whenRevealed({
            target: {
                mode: 'upTo',
                numCards: (context) => maxLocations(context),
                activePromptTitle: 'Select locations',
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'location',
                gameAction: 'kneel'
            },
            message: '{player} uses {source} to kneel {target}',
            gameAction: GameActions.simultaneously((context) =>
                context.target.map((card) => GameActions.kneelCard({ card }))
            )
        });
    }
}

ACityBesieged.code = '13040';

export default ACityBesieged;
