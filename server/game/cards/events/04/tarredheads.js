const DrawCard = require('../../../drawcard.js');

class TarredHeads extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => (
                    challenge.challengeType === 'power' && 
                    challenge.winner === this.controller &&
                    this.opponentHasCards())
            },
            handler: () => {
                let opponent = this.game.getOtherPlayer(this.controller);
                
                opponent.discardAtRandom(1, cards => {
                    let card = cards[0];
                    let deadMessage = '';

                    if(card.getType() === 'character') {
                        deadMessage = ' and place it in the dead pile';
                        opponent.moveCard(card, 'dead pile');
                    }

                    this.game.addMessage('{0} plays {1} to discard {2} from {3}\'s hand{4}',
                                          this.controller, this, card, opponent, deadMessage);
                });
            }
        });
    }

    opponentHasCards() {
        let opponent = this.game.getOtherPlayer(this.controller);
        return opponent && opponent.hand.size() >= 1;
    }
}

TarredHeads.code = '04119';

module.exports = TarredHeads;
