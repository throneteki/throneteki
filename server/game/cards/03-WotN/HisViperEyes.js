const DrawCard = require('../../drawcard.js');

class HisViperEyes extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: event =>
                    event.challenge.defendingPlayer === this.controller &&
                    event.challenge.loser === this.controller &&
                    ['military', 'power'].includes(event.challenge.challengeType) &&
                    event.challenge.winner.hand.size() >= 1
            },
            handler: () => {
                this.challengeWinner = this.game.currentChallenge.winner;

                let buttons = this.challengeWinner.hand.map(card => {
                    return { method: 'cardSelected', card: card };
                });

                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Select a card',
                        buttons: buttons
                    },
                    source: this
                });
            }
        });
    }

    cardSelected(player, cardId) {
        var otherPlayer = this.challengeWinner;

        var card = otherPlayer.findCardByUuid(otherPlayer.hand, cardId);
        if(!card) {
            return false;
        }

        otherPlayer.discardCard(card);

        this.game.addMessage('{0} uses {1} to discard {2} from {3}\'s hand', player, this, card, otherPlayer);

        return true;
    }
}

HisViperEyes.code = '03032';

module.exports = HisViperEyes;
