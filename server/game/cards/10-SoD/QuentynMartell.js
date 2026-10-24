import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class QuentynMartell extends DrawCard {
    // Quentyn Martell (10011)
    // Renown.
    // Forced Reaction: After the challenges phase begins, if there are fewer than 3 plot cards in
    // your used pile, kneel Quentyn Martell.
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onPhaseStarted: (event, context) =>
                    event.phase === 'challenge' &&
                    context.source.controller.getNumberOfUsedPlots() < 3
            },
            message: '{player} is forced to kneel {source}',
            gameAction: GameActions.kneelCard((context) => ({ card: context.source }))
        });
    }
}

QuentynMartell.code = '10011';

export default QuentynMartell;
