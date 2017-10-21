const ResolvedTargets = require('./gamesteps/ResolvedTargets.js');

class AbilityContext {
    constructor(properties) {
        this.challenge = properties.challenge;
        this.game = properties.game;
        this.source = properties.source;
        this.player = properties.player;
        this.costs = {};
        this.targets = new ResolvedTargets();
    }
}

module.exports = AbilityContext;
