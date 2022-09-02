const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');
const Array = require('../../../Array');
const TextHelper = require('../../TextHelper');

class SteelRain extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Search deck for GJ locations',
            cost: ability.costs.sacrificeAny(card => card.isFaction('greyjoy') && card.getType() === 'location', false),
            message: {
                format: '{player} plays {source} to sacrifice {costs.sacrifice} and search their deck for up to {amount} Greyjoy locations',
                args: { amount: context => context.costs.sacrifice.length }
            },
            gameAction: GameActions.search({
                title: context => `Select locations for ${TextHelper.formatList(context.costs.sacrifice.map(card => card.name), 'and')}`,
                numToSelect: context => context.costs.sacrifice.length,
                match: {
                    faction: 'greyjoy',
                    type: 'location',
                    condition: (card, context) => Array.availableToPair(context.costs.sacrifice || [], context.selectedCards, (sacrificed, card) => this.isSelectableLocationFor(sacrificed, card))
                        .some(available => this.isSelectableLocationFor(available, card))
                },
                reveal: false,
                message: '{player} puts {searchTarget} into play from their draw deck',
                gameAction: GameActions.simultaneously(context => context.searchTarget.map(card => GameActions.putIntoPlay({ card })))
            })
        });
    }

    isSelectableLocationFor(sacrificed, card) {
        return card.name !== sacrificed.name && card.hasPrintedCost() && sacrificed.hasPrintedCost() && card.getPrintedCost() <= sacrificed.getPrintedCost();
    }
}

SteelRain.code = '11032';

module.exports = SteelRain;
