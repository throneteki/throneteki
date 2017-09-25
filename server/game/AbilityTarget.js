const _ = require('underscore');

class AbilityTarget {
    constructor(name, properties) {
        this.name = name;
        this.properties = properties;
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
        let cardCondition = this.properties.cardCondition;
        let otherProperties = _.omit(this.properties, 'cardCondition');
        let result = { resolved: false, name: this.name, value: null };
        let promptProperties = {
            source: context.source,
            cardCondition: card => cardCondition(card, context),
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
