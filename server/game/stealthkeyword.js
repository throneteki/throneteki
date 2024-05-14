import ChallengeKeywordAbility from './ChallengeKeywordAbility.js';
import BypassByStealth from './GameActions/BypassByStealth.js';

class StealthKeyword extends ChallengeKeywordAbility {
    constructor() {
        super('Stealth', {
            target: {
                activePromptTitle: (context) => this.defaultTargetPromptTitle(context),
                numCards: (context) => this.getTriggerAmount(context),
                cardCondition: (card, context) =>
                    BypassByStealth.allow({
                        card,
                        source: context.source,
                        challenge: context.challenge
                    })
            },
            message: {
                format: '{player} uses {source} to bypass {targets} using stealth',
                args: { targets: (context) => context.targets.getTargets() }
            },
            handler: (context) => {
                context.targets.getTargets().forEach((target) => {
                    let props = {
                        challenge: context.challenge,
                        source: context.source,
                        card: target
                    };
                    context.challenge.addInitiationAction(BypassByStealth, props);
                });
            }
        });
    }

    meetsKeywordRequirements(context) {
        return context.source.isDeclaredAsAttacker();
    }
}

export default StealthKeyword;
