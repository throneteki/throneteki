const DrawCard = require('../../drawcard.js');

class RubyOfRhllor extends DrawCard {
    setupCardAbilities() {
        this.attachmentRestriction(
            { trait: 'R\'hllor' }
        );
        this.reaction({
            when: {
                afterChallenge: event =>
                    event.challenge.challengeType === 'intrigue' &&
                    event.challenge.winner === this.controller &&
                    event.challenge.isAttacking(this.parent)
            },
            handler: () => {
                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Name a card',
                        controls: [
                            { type: 'card-name', command: 'menuButton', method: 'selectCardName' }
                        ]
                    }
                });
            }
        });
    }

    selectCardName(player, cardName) {
        const loser = this.game.currentChallenge.loser;
        const matchingCards = loser.hand.filter(card => card.name === cardName);

        this.game.addMessage('{0} uses {1} to name {2}, reveal {3}\'s hand as {4} and discard all matching cards by name', this.controller, this, cardName, loser, loser.hand);
        if(matchingCards.length === 0) {
            return true;
        }

        loser.discardCards(matchingCards);

        return true;
    }
}

RubyOfRhllor.code = '04009';

module.exports = RubyOfRhllor;
