const PlotCard = require('../../plotcard');

class ManningTheCityWalls extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            target: {
                cardCondition: (card, context) => (
                    card.controller === context.player &&
                    card.location === 'hand' &&
                    card.getType() === 'character' &&
                    !card.isUnique() &&
                    card.getPrintedCost() <= this.maxPrintedCost(context) &&
                    context.player.canPutIntoPlay(card)
                )
            },
            message: '{player} uses {source} to put {target} into play',
            handler: context => {
                context.player.putIntoPlay(context.target);
            }
        });
    }

    maxPrintedCost(context) {
        return this.hasUsedCityPlot(context.player) ? 6 : 3;
    }

    hasUsedCityPlot(player) {
        return this.game.allCards.some(card => (
            card.controller === player &&
            card.location === 'revealed plots' &&
            card.hasTrait('City')
        ));
    }
}

ManningTheCityWalls.code = '13060';

module.exports = ManningTheCityWalls;
