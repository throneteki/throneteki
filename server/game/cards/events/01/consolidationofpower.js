const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class ConsolidationOfPower extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Kneel 4 STR worth of characters',
            phase: 'marshal',
            target: {
                numCards: 99,
                activePromptTitle: 'Select characters',
                maxStat: () => 4,
                cardStat: card => card.getStrength(),
                cardCondition: card => card.location === 'play area' && card.getType() === 'character' && !card.kneeled,
                gameAction: 'kneel'
            },
            handler: context => {
                this.cards = context.target;
                this.game.promptForSelect(this.controller, {
                    activePromptTitle: 'Select character to gain power',
                    source: this,
                    cardCondition: card => {
                        return _.contains(this.cards, card);
                    },
                    onSelect: (player, card) => this.onPowerSelected(player, card),
                    onCancel: (player) => this.cancelSelection(player)
                });
            }
        });
    }

    onPowerSelected(player, card) {
        _.each(this.cards, card => {
            card.controller.kneelCard(card);
        });

        card.modifyPower(1);

        this.game.addMessage('{0} uses {1} to kneel {2} and have {3} gain 1 power',
                             player, this, this.cards, card);

        return true;
    }

    cancelSelection(player) {
        this.game.addMessage('{0} cancels the resolution of {1}', player, this);
    }
}

ConsolidationOfPower.code = '01062';

module.exports = ConsolidationOfPower;
