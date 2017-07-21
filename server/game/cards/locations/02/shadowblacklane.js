const DrawCard = require('../../../drawcard.js');

class ShadowblackLane extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (e, challenge) => challenge.winner === this.controller && challenge.challengeType === 'intrigue'
            },
            cost: ability.costs.kneelFactionCard(),
            handler: () => {
                this.game.promptForDeckSearch(this.controller, {
                    numCards: 10,
                    activePromptTitle: 'Select a card to add to your hand',
                    cardCondition: card => card.getType() === 'event' && card.isFaction(this.controller.faction.getPrintedFaction()),
                    onSelect: (player, card) => this.cardSelected(player, card),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    cardSelected(player, card) {
        player.moveCard(card, 'hand');
        this.game.addMessage('{0} uses {1} to search their deck and add {2} to their hand',
            player, this, card);
    }

    doneSelecting(player) {
        this.game.addMessage('{0} uses {1} to search their deck but does not add any card to their hand',
            player, this);
    }
}

ShadowblackLane.code = '02038';

module.exports = ShadowblackLane;
