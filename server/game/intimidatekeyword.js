const BaseAbility = require('./baseability.js');
const GameActions = require('./GameActions');

class IntimidateKeyword extends BaseAbility {
    constructor() {
        super({
            target: {
                activePromptTitle: 'Select a character to intimidate',
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

    canIntimidate(card, strength, challenge) {
        return !card.kneeled
            && card.controller === challenge.loser
            && card.location === 'play area'
            && card.getType() === 'character'
            && card.getStrength() <= strength;
    }
}

module.exports = IntimidateKeyword;
