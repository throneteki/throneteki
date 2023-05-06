const KeywordAbility = require('./KeywordAbility.js');
const TargetByAssault = require('./GameActions/TargetByAssault.js');

class AssaultKeyword extends KeywordAbility {
    constructor() {
        super('Assault', {
            target: {
                activePromptTitle: context => this.defaultTargetPromptTitle(context),
                numCards: context => this.getTriggerAmount(context),
                cardCondition: (card, context) => TargetByAssault.allow({ target: card, source: context.source, challenge: context.challenge })
            },
            message: {
                format: '{player} uses {source} to blank {targets} using assault until the end of the challenge',
                args: { targets: context => context.targets.getTargets() }
            },
            handler: context => {
                context.targets.getTargets().forEach(target => {
                    let props = { challenge: context.challenge, source: context.source, target };
                    context.challenge.addInitiationAction(TargetByAssault, props);
                });
            }
        });
    }

    meetsRequirements(context) {
        return context.source.isAttacking() && context.source.allowGameAction('targetUsingAssault', context);
    }
}

module.exports = AssaultKeyword;
