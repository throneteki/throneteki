const _ = require('underscore');

const AbilityTargetSelection = require('./AbilityTargetSelection.js');
const CardSelector = require('./CardSelector.js');

class AbilityTarget {
    constructor(name, properties) {
        this.type = properties.type || 'choose';
        this.name = name;
        this.properties = properties;
        this.selector = CardSelector.for(properties);
        this.ifAble = !!properties.ifAble;
    }

    canResolve(context) {
        return this.ifAble || this.selector.hasEnoughTargets(context);
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

        if(this.ifAble && !this.selector.hasEnoughTargets(context)) {
            result.reject();
            return result;
        }

        let promptProperties = {
            context: context,
            source: context.source,
            selector: this.selector,
            onSelect: (player, card) => {
                result.resolve(card);
                return true;
            },
            onCancel: () => {
                if(this.ifAble) {
                    result.reject();
                } else {
                    result.cancel();
                }
                return true;
            }
        };
        context.game.promptForSelect(context.player, _.extend(promptProperties, otherProperties));
        return result;
    }
}

module.exports = AbilityTarget;
