const BaseAbility = require('./baseability.js');
const GameActions = require('./GameActions');

class IntimidateKeyword extends BaseAbility {
    constructor() {
        super({
            target: {
                activePromptTitle: context => this.getTitle(context.source),
                numCards: context => this.getAmount(context.source),
                cardCondition: (card, context) => this.canIntimidate(card, context.challenge.strengthDifference, context.challenge),
                gameAction: 'kneel'
            },
            message: '{player} uses intimidate from {source} to kneel {target}',
            handler: context => {
                context.game.resolveGameAction(GameActions.kneelCard(context => ({
                    card: context.target,
                    reason: 'intimidate',
                    source: context.source
                })), context);
            }
        });
        this.title = 'Intimidate';
    }

    getTitle(source) {
        var numTargets = this.getAmount(source);
        return `Select ${numTargets === 1 ? 'a character' : `up to ${numTargets} characters`} to intimidate`;
    }

    getAmount(source) {
        return 1 + source.getKeywordTriggerModifier(this.title);
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
