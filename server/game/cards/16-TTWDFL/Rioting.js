import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class Rioting extends PlotCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onPhaseStarted: (event) => event.phase === 'standing'
            },
            message: {
                format: '{player} is forced by {source} to discard {characters} from play',
                args: { characters: () => this.getKneelingCharacters() }
            },
            gameAction: GameActions.simultaneously(() =>
                this.getKneelingCharacters().map((card) =>
                    GameActions.discardCard({ card, allowSave: false })
                )
            )
        });
    }

    getKneelingCharacters() {
        return this.game.filterCardsInPlay(
            (card) => card.getType() === 'character' && card.kneeled
        );
    }
}

Rioting.code = '16032';

export default Rioting;
