const DrawCard = require('../../drawcard.js');
const TextHelper = require('../../TextHelper');

class Qyburn extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCharacterKilled: () => this.controller.canDraw()
            },
            cost: ability.costs.kneelSelf(),
            handler: () => {
                let cards = this.controller.drawCardsToHand(2).length;
                this.game.addMessage(
                    '{0} kneels {1} to draw {2}',
                    this.controller,
                    this,
                    TextHelper.count(cards, 'card')
                );

                this.game.promptForSelect(this.controller, {
                    activePromptTitle: 'Select a card',
                    cardCondition: (card) =>
                        card.controller === this.controller && card.location === 'hand',
                    onSelect: (player, card) => this.putCardBack(player, card),
                    onCancel: (player) => this.cancelResolution(player)
                });
            }
        });
    }

    putCardBack(player, card) {
        player.discardCard(card);
        this.game.addMessage('{0} then discards {1} for {2}', this.controller, card, this);

        return true;
    }

    cancelResolution(player) {
        this.game.addAlert('danger', '{0} cancels resolution of {1}', player, this);

        return true;
    }
}

Qyburn.code = '08109';

module.exports = Qyburn;
