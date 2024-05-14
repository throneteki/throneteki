const PlotCard = require('../../plotcard.js');

class WardensOfTheWest extends PlotCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.challengeType === 'intrigue'
            },
            cost: ability.costs.payGold(2),
            handler: () => {
                this.game.promptForSelect(this.game.currentChallenge.loser, {
                    numCards: 2,
                    activePromptTitle: 'Select 2 cards to discard',
                    source: this,
                    cardCondition: (card) =>
                        card.controller === this.game.currentChallenge.loser &&
                        card.location === 'hand',
                    onSelect: (player, cards) => this.onSelect(player, cards),
                    onCancel: (player) => this.cancelSelection(player)
                });

                this.game.addMessage(
                    '{0} uses {1} and pay 2 gold to have {2} discard 2 cards from their hand',
                    this.controller,
                    this,
                    this.game.currentChallenge.loser
                );
            }
        });
    }

    onSelect(player, cards) {
        player.discardCards(cards, false);

        this.game.addMessage('{0} chooses {1} to discard from their hand', player, cards);

        return true;
    }

    cancelSelection(player) {
        this.game.addAlert('danger', '{0} cancels the resolution of {1}', player, this);

        return true;
    }
}

WardensOfTheWest.code = '02030';

module.exports = WardensOfTheWest;
