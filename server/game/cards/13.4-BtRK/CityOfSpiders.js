import GameActions from '../../GameActions/index.js';
import PlotCard from '../../plotcard.js';

class CityOfSpiders extends PlotCard {
    // City of Spiders (13080)
    // When Revealed: Initiate the when revealed ability of a City plot card in your used pile as if
    // you had just revealed it.
    setupCardAbilities() {
        this.whenRevealed({
            target: {
                activePromptTitle: 'Select a plot',
                cardCondition: (card, context) =>
                    card.location === 'revealed plots' &&
                    card.controller === context.player &&
                    card.hasTrait('City') &&
                    card.name !== context.source.name &&
                    !!card.getWhenRevealedAbility(),
                cardType: 'plot'
            },
            message: '{player} uses {source} to initiate the When Revealed ability of {target}',
            gameAction: GameActions.initiateWhenRevealed((context) => ({ plot: context.target }))
        });
    }
}

CityOfSpiders.code = '13080';

export default CityOfSpiders;
