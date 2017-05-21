const DrawCard = require('../../../drawcard.js');

class WithoutHisBeard extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (e, challenge) => challenge.winner === this.controller && challenge.challengeType === 'intrigue'
            },
            handler: () => {
                let opponent = this.game.getOtherPlayer(this.controller);

                if(!opponent) {
                    return false;
                }
                
                opponent.discardAtRandom(3);
                opponent.drawCardsToHand(2);
                this.game.addMessage('{0} plays {1} to have {2} discard 3 cards at random, then draw 2 cards', 
                                      this.controller, this, opponent);
            }
        });
    }
}

WithoutHisBeard.code = '04070';

module.exports = WithoutHisBeard;
