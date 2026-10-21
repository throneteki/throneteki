import PlotCard from '../../plotcard.js';

class ManningTheCityWalls extends PlotCard {
    // Manning the City Walls (13060)
    // When Revealed: Put a non-unique character with printed cost 3 or lower into play from your
    // hand. (Printed cost 6 or lower instead if there is a City plot card in your used pile.)
    setupCardAbilities() {
        this.whenRevealed({
            target: {
                cardCondition: (card, context) =>
                    card.controller === context.player &&
                    card.location === 'hand' &&
                    card.getType() === 'character' &&
                    !card.isUnique() &&
                    card.getPrintedCost() <= this.maxPrintedCost(context) &&
                    context.player.canPutIntoPlay(card)
            },
            message: '{player} uses {source} to put {target} into play',
            handler: (context) => {
                context.player.putIntoPlay(context.target);
            }
        });
    }

    maxPrintedCost(context) {
        return this.hasUsedCityPlot(context.player) ? 6 : 3;
    }

    hasUsedCityPlot(player) {
        return player.getNumberOfUsedPlotsByTrait('City') > 0;
    }
}

ManningTheCityWalls.code = '13060';

export default ManningTheCityWalls;
