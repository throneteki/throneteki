const PlotCard = require('../../plotcard.js');

class ACityBesieged extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            target: {
                numCards: this.hasUsedCityPlot() ? 2 : 1,
                activePromptTitle: this.hasUsedCityPlot() ? 'Select up to 2 locations' : 'Select a location',
                ifAble: true,
                cardCondition: card => card.location === 'play area' && 
                                        card.getType() === 'location' && 
                                        !card.kneeled,
                gameAction: 'kneel'
            },
            handler: context => {
                if(this.hasUsedCityPlot()) {
                    for(let card of context.target) {
                        this.controller.kneelCard(card);
                    }
                } else {
                    this.controller.kneelCard(context.target);
                }

                this.game.addMessage('{0} uses {1} to kneel {2}', this.controller, this, context.target);
            }
        });
    }

    hasUsedCityPlot() {
        return this.game.allCards.some(card => (
            card.controller === this.controller &&
            card.location === 'revealed plots' &&
            card.hasTrait('City')
        ));
    }
}

ACityBesieged.code = '13040';

module.exports = ACityBesieged;
