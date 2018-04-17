const _ = require('underscore');

const AbilityTargetSelection = require('./AbilityTargetSelection.js');
const CardSelector = require('./CardSelector.js');

class AbilityTarget {
    constructor(name, properties) {
        this.type = properties.type || 'choose';
        this.name = name;
        this.properties = properties;
        this.selector = CardSelector.for(properties);
    }

    canResolve(context) {
        return this.selector.hasEnoughTargets(context);
    }

    resolve(context) {
        let eligibleCards = this.selector.getEligibleTargets(context);
        let otherProperties = _.omit(this.properties, 'cardCondition');
        let result = new AbilityTargetSelection({
            choosingPlayer: context.player,
            eligibleCards: eligibleCards,
            targetingType: this.type,
            name: this.name
        });
        let promptProperties = {
            context: context,
            source: context.source,
            selector: this.selector,
            onSelect: (player, card) => {
                result.resolve(card);
                return true;
            },
            onCancel: (player) => {
                result.reject();

                context.game.addAlert('danger', '{0} cancels the resolution of {1} (costs were still paid)', player, context.source);

                return true;
            }
        };
        context.game.promptForSelect(context.player, _.extend(promptProperties, otherProperties));
        return result;
    }
}

module.exports = AbilityTarget;
