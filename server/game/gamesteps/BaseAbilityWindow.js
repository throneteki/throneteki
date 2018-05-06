const uuid = require('uuid');

const BaseStep = require('./basestep.js');

class BaseAbilityWindow extends BaseStep {
    constructor(game, properties) {
        super(game);
        this.abilityChoices = [];
        this.event = properties.event;
        this.abilityType = properties.abilityType;
        this.resolvedAbilities = [];
    }

    canTriggerAbility(ability) {
        return ability.eventType === this.abilityType && this.event.getConcurrentEvents().some(event => ability.isTriggeredByEvent(event));
    }

    gatherChoices() {
        this.abilityChoices = [];
        this.event.emitTo(this.game, this.abilityType);
    }

    registerAbility(ability, event) {
        if(this.hasResolvedAbility(ability, event)) {
            return;
        }

        let context = ability.createContext(event);

        if(!ability.meetsRequirements(context)) {
            return;
        }

        let abilityGroupId = uuid.v1();

        for(let choiceText of ability.getChoices(context)) {
            this.abilityChoices.push({
                id: uuid.v1(),
                abilityGroupId: abilityGroupId,
                player: context.player,
                ability: ability,
                card: ability.card,
                text: choiceText.text,
                choice: choiceText.choice,
                context: context
            });
        }
    }

    hasResolvedAbility(ability, event) {
        return this.resolvedAbilities.some(resolved => resolved.ability === ability && resolved.event === event);
    }

    resolveAbility(ability, context) {
        this.game.resolveAbility(ability, context);
        this.markAbilityAsResolved(ability, context.event);
    }

    markAbilityAsResolved(ability, event) {
        this.resolvedAbilities.push({ ability: ability, event: event });
    }

    clearAbilityResolution(ability) {
        this.resolvedAbilities = this.resolvedAbilities.filter(resolvedAbility => resolvedAbility.ability !== ability);
    }
}

module.exports = BaseAbilityWindow;
