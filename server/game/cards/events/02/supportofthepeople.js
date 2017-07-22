const DrawCard = require('../../../drawcard.js');

class SupportOfThePeople extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => (
                    challenge.challengeType === 'power' &&
                    challenge.winner === this.controller &&
                    challenge.strengthDifference >= 5
                )
            },
            handler: () => {
                this.game.promptForDeckSearch(this.controller, {
                    activePromptTitle: 'Select a location to put into play',
                    cardCondition: card => card.getType() === 'location' && card.getCost() <= 3,
                    onSelect: (player, card) => this.cardSelected(player, card),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    cardSelected(player, card) {
        player.putIntoPlay(card);
        this.game.addMessage('{0} uses {1} to search their deck and put {2} into play',
            player, this, card);
    }

    doneSelecting(player) {
        this.game.addMessage('{0} uses {1} to search their deck but does not put any card into play',
            player, this);
    }
}

SupportOfThePeople.code = '02017';

module.exports = SupportOfThePeople;
