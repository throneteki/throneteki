const KeywordAbility = require('./KeywordAbility.js');
const GameActions = require('./GameActions');

class IntimidateKeyword extends KeywordAbility {
    constructor() {
        super('Intimidate', {
            target: {
                activePromptTitle: context => this.getIntimidatePromptTitle(context),
                numCards: context => this.getTriggerAmount(context),
                cardCondition: (card, context) => this.canIntimidate(card, context.challenge.strengthDifference, context.challenge),
                gameAction: 'kneel'
            },
            message: {
                format: '{player} uses {source} to kneel {targets} using intimidate',
                args: { targets: context => context.targets.getTargets() }
            },
            handler: context => {
                context.game.resolveGameAction(GameActions.kneelCard(context => ({
                    card: context.target,
                    reason: 'intimidate',
                    source: context.source
                })), context);
            }
        });
    }

    getIntimidatePromptTitle(context) {
        var numTargets = this.getTriggerAmount(context);
        return `Select ${numTargets === 1 ? 'a character' : `up to ${numTargets} characters`} to intimidate`;
    }

    canIntimidate(card, strength, challenge) {
        return !card.kneeled
            && card.controller === challenge.loser
            && card.location === 'play area'
            && card.getType() === 'character'
            && card.getStrength() <= strength;
    }

    meetsRequirements(context) {
        return context.source.isAttacking();
    }
}

module.exports = IntimidateKeyword;
