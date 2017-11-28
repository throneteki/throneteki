const _ = require('underscore');

const BaseStep = require('./basestep.js');

class BaseAbilityWindow extends BaseStep {
    constructor(game, properties) {
        super(game);
        this.abilityChoices = [];
        this.event = properties.event;
        this.abilityType = properties.abilityType;
    }

    canTriggerAbility(ability) {
        return ability.eventType === this.abilityType && _.any(this.event.getConcurrentEvents(), event => ability.isTriggeredByEvent(event));
    }

    emitEvents() {
        this.event.emitTo(this.game, this.abilityType);
    }

    registerAbilityForEachEvent(ability) {
        let matchingEvents = _.filter(this.event.getConcurrentEvents(), event => ability.isTriggeredByEvent(event));
        _.each(matchingEvents, event => {
            this.registerAbility(ability, event);
        });
    }
}

module.exports = BaseAbilityWindow;
