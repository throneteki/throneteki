import ResolvedTargets from './gamesteps/ResolvedTargets.js';

class AbilityContext {
    constructor(properties) {
        this.ability = properties.ability;
        this.challenge = properties.challenge;
        this.game = properties.game;
        this.gameAction = properties.ability && properties.ability.gameAction;
        this.source = properties.source;
        this.player = properties.player;
        this.costs = {};
        this.costValues = {};
        this.targets = new ResolvedTargets();
        this.resolutionStage = 'effect';
    }

    addCost(name, value) {
        if (!this.costValues[name]) {
            this.costValues[name] = [];
        }

        let valueAsArray = Array.isArray(value) ? value : [value];
        this.costValues[name] = this.costValues[name].concat(valueAsArray);
        this.costs[name] = value;
    }

    getCostValuesFor(name) {
        return this.costValues[name] || [];
    }
}

export default AbilityContext;
