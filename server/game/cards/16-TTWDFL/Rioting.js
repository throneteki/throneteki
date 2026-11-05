import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class Rioting extends PlotCard {
    // Rioting (16032)
    // Forced Reaction: After the standing phase begins, discard each kneeling character from play
    // (cannot be saved).
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onPhaseStarted: (event) => event.phase === 'standing'
            },
            message: {
                format: '{player} is forced by {source} to discard {characters} from play',
                args: { characters: (context) => context.source.getKneelingCharacters() }
            },
            gameAction: GameActions.simultaneously((context) =>
                context.source
                    .getKneelingCharacters()
                    .map((card) => GameActions.discardCard({ card, allowSave: false }))
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
