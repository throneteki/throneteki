import DrawCard from '../../drawcard.js';

class Freedmen extends DrawCard {
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
