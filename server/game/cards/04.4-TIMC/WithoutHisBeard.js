import DrawCard from '../../drawcard.js';

class WithoutHisBeard extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.challengeType === 'intrigue' &&
                    this.opponentHasCardsInHand(event.challenge.loser)
            },
            handler: (context) => {
                this.losingOpponent = context.event.challenge.loser;
                let nums = ['1', '2', '3'];

                let buttons = nums.map((num) => {
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
        let cards = opponent.drawCardsToHand(2).length;
        this.game.addMessage(
            '{0} plays {1} to have {2} discard {3} cards at random, then draw {4} cards',
            player,
            this,
            opponent,
            num,
            cards
        );

        return true;
    }

    opponentHasCardsInHand(opponent) {
        return opponent.hand.length >= 1;
    }
}

WithoutHisBeard.code = '04070';

export default WithoutHisBeard;
