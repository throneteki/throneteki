import GameActions from './GameActions/index.js';
import ChallengeKeywordAbility from './ChallengeKeywordAbility.js';
import BypassByStealth from './GameActions/BypassByStealth.js';

class StealthKeyword extends ChallengeKeywordAbility {
    constructor() {
        super('Stealth', {
            target: {
                declinable: true,
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
            gameAction: GameActions.simultaneously((context) =>
                [context.target]
                    .flat()
                    .filter(Boolean)
                    .map((card) =>
                        GameActions.queueChallengeAction({
                            action: BypassByStealth,
                            challenge: context.challenge,
                            source: context.source,
                            card
                        })
                    )
            )
        });
    }

    meetsKeywordRequirements(context) {
        return context.source.isDeclaredAsAttacker();
    }
}

export default StealthKeyword;
