const DrawCard = require('../../drawcard.js');

class TarredHeads extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: event => (
                    event.challenge.challengeType === 'power' &&
                    event.challenge.winner === this.controller &&
                    event.challenge.loser.hand.size() >= 1)
            },
            handler: context => {
                let opponent = context.event.challenge.loser;

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
}

TarredHeads.code = '04119';

module.exports = TarredHeads;
