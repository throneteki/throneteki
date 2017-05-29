const DrawCard = require('../../../drawcard.js');

class HisViperEyes extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => (
                    challenge.defendingPlayer === this.controller &&
                    challenge.loser === this.controller &&
                    ['military', 'power'].includes(challenge.challengeType) &&
                    challenge.winner.hand.size() >= 1
                )
            },
            handler: () => {
                let otherPlayer = this.game.currentChallenge.winner;

                let buttons = otherPlayer.hand.map(card => {
                    return { method: 'cardSelected', card: card };
                });

                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Select a card to discard',
                        buttons: buttons
                    },
                    source: this
                });
            }
        });
    }

    cardSelected(player, cardId) {
        var otherPlayer = this.game.getOtherPlayer(player);
        if(!otherPlayer) {
            return false;
        }

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
