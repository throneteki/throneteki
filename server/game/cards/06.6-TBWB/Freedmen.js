import DrawCard from '../../drawcard.js';

class Freedmen extends DrawCard {
    // Freedmen (06113)
    // Reaction: After you win a challenge by 5 or more STR as the attacking player, put Freedmen
    // into play from your discard pile.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.attackingPlayer === this.controller &&
                    event.challenge.strengthDifference >= 5 &&
                    this.controller.canPutIntoPlay(this)
            },
            location: 'discard pile',
            handler: (context) => {
                this.controller.putIntoPlay(this);
                this.game.addMessage(
                    '{0} puts {1} into play from their discard pile',
                    context.player,
                    this
                );
            }
        });
    }
}

Freedmen.code = '06113';

export default Freedmen;
