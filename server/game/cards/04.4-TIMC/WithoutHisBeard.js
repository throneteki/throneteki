const _ = require('underscore');

const DrawCard = require('../../drawcard.js');

class WithoutHisBeard extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: event => (
                    event.challenge.winner === this.controller &&
                    event.challenge.challengeType === 'intrigue' &&
                    this.opponentHasCardsInHand(event.challenge.loser))
            },
            handler: context => {
                this.losingOpponent = context.event.challenge.loser;
                let nums = ['1', '2', '3'];

                let buttons = _.map(nums, num => {
                    return { text: num, method: 'numSelected', arg: num };
                });

                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Select # of cards to discard',
                        buttons: buttons
                    },
                    source: this
                });
            }
        });
    }

    numSelected(player, num) {
        let opponent = this.losingOpponent;
        opponent.discardAtRandom(num);
        opponent.drawCardsToHand(2);
        this.game.addMessage('{0} plays {1} to have {2} discard {3} cards at random, then draw 2 cards',
            player, this, opponent, num);

        return true;
    }

    opponentHasCardsInHand(opponent) {
        return opponent.hand.size() >= 1;
    }
}

WithoutHisBeard.code = '04070';

module.exports = WithoutHisBeard;
