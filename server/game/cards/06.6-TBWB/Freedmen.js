import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Freedmen extends DrawCard {
    // Freedmen (06113)
    // Reaction: After you win a challenge by 5 or more STR as the attacking player, put Freedmen
    // into play from your discard pile.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    event.challenge.attackingPlayer === context.source.controller &&
                    event.challenge.strengthDifference >= 5 &&
                    context.source.controller.canPutIntoPlay(context.source)
            },
            location: 'discard pile',
            message: '{player} puts {source} into play from their discard pile',
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.source
            }))
        });
    }
}

Freedmen.code = '06113';

export default Freedmen;
