const DrawCard = require('../../drawcard.js');
const TextHelper = require('../../TextHelper');

class DeepwoodMotte extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPlotRevealed: event => event.plot.hasTrait('Winter') && !this.kneeled
            },
            cost: ability.costs.kneelSelf(),
            handler: context => {
                let xValue = context.event.plot.getReserve();

                this.game.addMessage('{0} uses {1} to kneel up to {2} locations with printed cost 1 or lower', context.player, this, xValue);
                this.game.promptForSelect(context.player, {
                    activePromptTitle: `Select up to ${TextHelper.count(xValue, 'locations')}`,
                    optional: true,
                    ifAble: true,
                    numCards: xValue,
                    source: this,
                    cardCondition: card => card.getType() === 'location' && card.location === 'play area' && !card.kneeled,
                    onSelect: (player, cards) => this.onCardsSelected(player, cards),
                    onCancel: (player) => this.onSelectionCancelled(player)
                });
            }
        });
    }

    onSelectionCancelled(player) {
        this.game.addMessage('{0} does not select any location for {1}', player, this);
        this.proceedToNextStep();
    }

    onCardsSelected(player, cards) {
        for(let card of cards) {
            player.kneelCard(card);
        }

        this.game.addMessage('{0} uses {1} to kneel {2}', player, this, cards);
        return true;
    }
}

DeepwoodMotte.code = '25507';
DeepwoodMotte.version = '1.0';

module.exports = DeepwoodMotte;
