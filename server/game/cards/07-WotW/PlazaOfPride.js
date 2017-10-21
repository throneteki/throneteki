const DrawCard = require('../../drawcard.js');

class PlazaOfPride extends DrawCard {

    setupCardAbilities(ability) {
        this.action({
            title: 'Stand character',
            cost: [
                ability.costs.kneelSelf(),
                ability.costs.discardFromHand()
            ],
            handler: context => {
                this.game.promptForSelect(this.controller, {
                    activePromptTitle: 'Select a character',
                    source: this,
                    cardCondition: card =>
                        card.location === 'play area'
                        && card.getType() === 'character'
                        && card.kneeled
                        && card.getCost() <= context.costs.discardFromHand.getCost() + 3,
                    onSelect: (player, card) => this.onCardSelected(player, card, context.costs.discardFromHand)
                });
            }
        });
    }

    onCardSelected(player, card, discardedCard) {
        player.standCard(card);
        this.game.addMessage('{0} kneels {1} and discards {2} to stand {3}', this.controller, this, discardedCard, card);

        return true;
    }

}

PlazaOfPride.code = '07036';

module.exports = PlazaOfPride;
