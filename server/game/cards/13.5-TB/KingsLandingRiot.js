const PlotCard = require('../../plotcard');
const GameActions = require('../../GameActions');

class KingsLandingRiot extends PlotCard {
    setupCardAbilities() {
        this.forcedInterrupt({
            when: {
                onPhaseEnded: (event) =>
                    event.phase === 'challenge' &&
                    this.controller.getNumberOfUsedPlotsByTrait('City') >= 3
            },
            message: {
                format: '{player} is forced by {source} to discard {charactersInPlay}',
                args: { charactersInPlay: () => this.charactersInPlay() }
            },
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.simultaneously(
                        this.charactersInPlay().map((card) => GameActions.discardCard({ card }))
                    ),
                    context
                );
            }
        });
    }

    charactersInPlay() {
        return this.game.filterCardsInPlay((card) => card.getType() === 'character');
    }
}

KingsLandingRiot.code = '13100';

module.exports = KingsLandingRiot;
