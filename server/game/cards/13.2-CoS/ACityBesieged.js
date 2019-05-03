const PlotCard = require('../../plotcard.js');

class ACityBesieged extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: () => {
                let numTargets = this.hasUsedCityPlot() ? 2 : 1;

                this.game.promptForSelect(this.controller, {
                    mode: 'upTo',
                    numCards: numTargets,
                    activePromptTitle: this.hasUsedCityPlot() ? 'Select up to 2 locations' : 'Select a location',
                    source: this,
                    gameAction: 'kneel',
                    cardCondition: card => card.location === 'play area' &&
                                            card.getType() === 'location' &&
                                            !card.kneeled,
                    onSelect: (player, cards) => this.targetsSelected(player, cards)
                })
            }
        });
    }

    targetsSelected(player, cards) {
        for(let card of cards) {
            this.controller.kneelCard(card);
        }

        this.game.addMessage('{0} uses {1} to kneel {2}', player, this, cards);
        return true;
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
