const PlotCard = require('../../plotcard');

class WardensOfTheEast extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => !this.game.getOpponents(this.controller).some(opponent => opponent.activePlot && opponent.activePlot.hasTrait('Siege')),
            effect: ability.effects.cannotBeFirstPlayer()
        });

        this.reaction({
            when: {
                afterChallenge: event => (
                    event.challenge.winner === this.controller &&
                    event.challenge.defenders.some(defender => defender.hasTrait('House Arryn')) &&
                    this.controller.activePlot.getClaim() < 3
                )
            },
            message: '{player} uses {source} to raise the claim on their revealed plot by 1',
            handler: () => {
                this.untilEndOfPhase(ability => ({
                    match: this,
                    effect: ability.effects.modifyClaim(1)
                }));
            }
        });
    }
}

WardensOfTheEast.code = '23039';

module.exports = WardensOfTheEast;
