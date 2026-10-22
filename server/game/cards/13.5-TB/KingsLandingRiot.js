import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class KingsLandingRiot extends PlotCard {
    // King's Landing Riot (13100)
    // Forced Interrupt: When the challenges phase ends, if there are 3 or more City plot cards in
    // your used pile, discard each character from play.
    setupCardAbilities() {
        this.forcedInterrupt({
            when: {
                onPhaseEnded: (event, context) =>
                    event.phase === 'challenge' &&
                    context.player.getNumberOfUsedPlotsByTrait('City') >= 3
            },
            message: {
                format: '{player} is forced by {source} to discard {charactersInPlay}',
                args: { charactersInPlay: (context) => charactersInPlay(context) }
            },
            gameAction: GameActions.simultaneously((context) =>
                charactersInPlay(context).map((card) => GameActions.discardCard({ card }))
            )
        });
    }
}

function charactersInPlay(context) {
    return context.game.filterCardsInPlay((card) => card.getType() === 'character');
}

KingsLandingRiot.code = '13100';

export default KingsLandingRiot;
