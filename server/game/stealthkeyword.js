const KeywordAbility = require('./KeywordAbility.js');
const BypassByStealth = require('./GameActions/BypassByStealth.js');

class StealthKeyword extends KeywordAbility {
    constructor() {
        super('Stealth', {
            target: {
                activePromptTitle: context => this.defaultTargetPromptTitle(context),
                numCards: context => this.getTriggerAmount(context),
                cardCondition: (card, context) => BypassByStealth.allow({ card, source: context.source, challenge: context.challenge })
            },
            message: {
                format: '{player} uses {source} to bypass {targets} using stealth',
                args: { targets: context => context.targets.getTargets() }
            },
            handler: context => {
                context.targets.getTargets().forEach(target => {
                    let props = { challenge: context.challenge, source: context.source, card: target };
                    context.challenge.addInitiationAction(BypassByStealth, props);
                });
            }
        });
    }

    meetsRequirements(context) {
        return context.source.isAttacking() && context.source.allowGameAction('targetUsingStealth', context);
    }
}

module.exports = StealthKeyword;
