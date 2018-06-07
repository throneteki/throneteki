const DrawCard = require('../../drawcard.js');

class SupportOfThePeople extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: event => (
                    event.challenge.challengeType === 'power' &&
                    event.challenge.winner === this.controller &&
                    event.challenge.strengthDifference >= 5
                )
            },
            handler: () => {
                this.game.promptForDeckSearch(this.controller, {
                    activePromptTitle: 'Select a location',
                    cardCondition: card => card.getType() === 'location' && card.getPrintedCost() <= 3,
                    onSelect: (player, card) => this.cardSelected(player, card),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            },
            max: ability.limit.perChallenge(1)
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
