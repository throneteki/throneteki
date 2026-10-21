import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class KingsLandingRiot extends PlotCard {
    // King's Landing Riot (13100)
    // Forced Interrupt: When the challenges phase ends, if there are 3 or more City plot cards in
    // your used pile, discard each character from play.
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

export default KingsLandingRiot;
