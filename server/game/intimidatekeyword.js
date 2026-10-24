import ChallengeKeywordAbility from './ChallengeKeywordAbility.js';
import GameActions from './GameActions/index.js';

class IntimidateKeyword extends ChallengeKeywordAbility {
    constructor() {
        super('Intimidate', {
            target: {
                activePromptTitle: (context) => this.targetPromptTitle(context),
                numCards: (context) => this.getTriggerAmount(context),
                cardCondition: (card, context) =>
                    this.canIntimidate(
                        card,
                        context.challenge.strengthDifference,
                        context.challenge
                    ),
                gameAction: 'kneel'
            },
            message: {
                format: '{player} uses {source} to kneel {targets} using intimidate',
                args: { targets: (context) => context.targets.getTargets() }
            },
            gameAction: GameActions.simultaneously((context) =>
                [context.target]
                    .flat()
                    .filter(Boolean)
                    .map((card) =>
                        GameActions.kneelCard({
                            card,
                            reason: 'intimidate',
                            source: context.source
                        })
                    )
            )
        });
        // Order by highest printed cost (sorts by smallest values first)
        this.orderBy = (context) => -context.source.getPrintedCost();
    }

    targetPromptTitle(context) {
        let numTargets = this.getTriggerAmount(context);
        return `Select ${numTargets === 1 ? 'a character' : `up to ${numTargets} characters`} to intimidate for ${context.source.name}`;
    }

    getTriggerAmount(context) {
        return (
            super.getTriggerAmount(context) -
            context.resolved.reduce(
                (total, resolvedIntimidate) =>
                    (total += resolvedIntimidate.context.targets.getTargets().length),
                0
            )
        );
    }

    canIntimidate(card, strength, challenge) {
        return (
            !card.kneeled &&
            card.controller === challenge.loser &&
            card.location === 'play area' &&
            card.getType() === 'character' &&
            card.getStrength() <= strength
        );
    }

    meetsKeywordRequirements(context) {
        return context.source.isAttacking();
    }
}

export default IntimidateKeyword;
