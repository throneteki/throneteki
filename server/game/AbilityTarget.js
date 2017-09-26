const _ = require('underscore');

const CardSelector = require('./CardSelector.js');

class AbilityTarget {
    constructor(name, properties) {
        this.name = name;
        this.properties = properties;
        this.selector = CardSelector.for(properties);
    }

    canResolve(context) {
        const ValidTypes = ['character', 'attachment', 'location', 'event', 'faction'];

        return context.game.allCards.any(card => {
            if(!ValidTypes.includes(card.getType())) {
                return false;
            }

            return this.properties.cardCondition(card, context);
        });
    }

    resolve(context) {
        let otherProperties = _.omit(this.properties, 'cardCondition');
        let result = { resolved: false, name: this.name, value: null };
        let promptProperties = {
            context: context,
            source: context.source,
            selector: this.selector,
            onSelect: (player, card) => {
                result.resolved = true;
                result.value = card;
                return true;
            },
            onCancel: () => {
                result.resolved = true;
                return true;
            }
        };
        context.game.promptForSelect(context.player, _.extend(promptProperties, otherProperties));
        return result;
    }
}

module.exports = AbilityTarget;
