const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class WithoutHisBeard extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (e, challenge) => (
                    challenge.winner === this.controller && 
                    challenge.challengeType === 'intrigue' &&
                    this.opponentHasCardsInHand())
            },
            handler: () => {
                let opponent = this.game.getOtherPlayer(this.controller);

                if(!opponent) {
                    return false;
                }

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
        let opponent = this.game.getOtherPlayer(this.controller);
        opponent.discardAtRandom(num);
        opponent.drawCardsToHand(2);
        this.game.addMessage('{0} plays {1} to have {2} discard {3} cards at random, then draw 2 cards', 
                              player, this, opponent, num);

        return true;
    }

    opponentHasCardsInHand() {
        let otherPlayer = this.game.getOtherPlayer(this.controller);

        if(!otherPlayer) {
            return false;
        }

        return otherPlayer.hand.size() >= 1;
    }
}

WithoutHisBeard.code = '04070';

module.exports = WithoutHisBeard;
