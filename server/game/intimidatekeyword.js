const BaseAbility = require('./baseability.js');

class IntimidateKeyword extends BaseAbility {
    constructor() {
        super({});
        this.title = 'Intimidate';
        this.targets = super.buildTargets(this.getTargetProperty());
    }

    getTargetProperty() {
        return {
            target: {
                activePromptTitle: 'Select a character to intimidate',
                cardCondition: (card, context) => this.canIntimidate(card, context.challenge.strengthDifference, context.challenge),
                gameAction: 'kneel'
            }
        };
    }

    meetsRequirements(context) {
        return context.challenge.isAttackerTheWinner() && this.canResolveTargets(context);
    }

    executeHandler(context) {
        context.target.controller.kneelCard(context.target);
        context.game.addMessage('{0} uses intimidate from {1} to kneel {2}', context.source.controller, context.source, context.target);
    }

    canIntimidate(card, strength, challenge) {
        return !card.kneeled
            && card.controller === challenge.loser
            && card.location === 'play area'
            && card.getType() === 'character'
            && card.getStrength() <= strength;
    }
}

module.exports = IntimidateKeyword;
