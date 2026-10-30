import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class VanquishTheUnbelievers extends PlotCard {
    // Vanquish the Unbelievers (12052)
    // Forced Reaction: After the challenges phase begins, choose a Trait. Kill each character you
    // control that does not have that Trait (cannot be saved).
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onPhaseStarted: (event) => event.phase === 'challenge'
            },
            gameAction: GameActions.nameTrait({
                message:
                    '{player} is forced by {source} to kill characters they control without the {trait} trait',
                gameAction: GameActions.simultaneously((context) =>
                    context.player
                        .filterCardsInPlay(
                            (card) =>
                                card.getType() === 'character' && !card.hasTrait(context.namedTrait)
                        )
                        .map((card) => GameActions.kill({ card, allowSave: false }))
                )
            })
        });
    }
}

VanquishTheUnbelievers.code = '12052';

export default VanquishTheUnbelievers;
