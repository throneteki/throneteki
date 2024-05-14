import ChallengeKeywordAbility from './ChallengeKeywordAbility.js';
import TargetByAssault from './GameActions/TargetByAssault.js';

class AssaultKeyword extends ChallengeKeywordAbility {
    constructor() {
        super('Assault', {
            target: {
                activePromptTitle: (context) => this.defaultTargetPromptTitle(context),
                numCards: (context) => this.getTriggerAmount(context),
                optional: true,
                cardCondition: (card, context) =>
                    TargetByAssault.allow({
                        card,
                        source: context.source,
                        challenge: context.challenge
                    })
            },
            message: {
                format: '{player} uses {source} to blank {targets} using assault until the end of the challenge',
                args: { targets: (context) => context.targets.getTargets() }
            },
            handler: (context) => {
                context.targets.getTargets().forEach((target) => {
                    let props = {
                        challenge: context.challenge,
                        source: context.source,
                        card: target
                    };
                    context.challenge.addInitiationAction(TargetByAssault, props);
                });
            }
        });
        // Order by highest printed cost (sorts by smallest values first)
        this.orderBy = (context) => -context.source.getPrintedCost();
    }

    getTriggerAmount(context) {
        // Need to offset the base trigger amount based on previously-resolved assault targets, and whether they "used" the baseTriggerAmount in their targeting.
        // eg. King Robb's Bannermen can assault 2 locations, but attacker chooses to only assault 1; offset would be 0, as the base trigger amount was
        //     not actually "used", and thus the next character may assault 1 location. Similarly, if the other character instead assaulted 1 location first ("using"
        //     that base trigger amount), then King Robb's Bannermen would only be able to assault 1 location, as the base has been "used", but only it can assault 1
        //     additional location, on top of that base.
        let totalBaseTriggerOffset = context.resolved.reduce(
            (offset, resolvedAssault) => (offset += resolvedAssault.context.baseTriggerOffset),
            0
        );
        return Math.max(super.getTriggerAmount(context) + totalBaseTriggerOffset, 0);
    }

    meetsKeywordRequirements(context) {
        return context.source.isDeclaredAsAttacker();
    }

    executeHandler(context) {
        let additionalTriggers = this.getTriggerAmount(context) - this.baseTriggerAmount;
        context.baseTriggerOffset = Math.min(
            additionalTriggers - context.targets.getTargets().length,
            0
        );
        super.executeHandler(context);
    }
}

export default AssaultKeyword;
