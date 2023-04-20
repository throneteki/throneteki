const KeywordAbility = require('./KeywordAbility.js');
const TargetByAssault = require('./GameActions/TargetByAssault.js');

class AssaultKeyword extends KeywordAbility {
    constructor() {
        super('Assault', {
            target: {
                activePromptTitle: context => this.defaultTargetPromptTitle(context),
                numCards: context => this.getTriggerAmount(context),
                cardCondition: (card, context) => this.canAssault(card, context.challenge, context.source),
                gameAction: 'targetByAssault'
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
    
    canAssault(card, challenge, source) {
        return card.controller === challenge.defendingPlayer &&
            card.location === 'play area' &&
            card.getType() === 'location' &&
            (source.challengeOptions.contains('ignoresAssaultLocationCost') || card.getPrintedCost() < source.getPrintedCost());
    }

    meetsRequirements(context) {
        return context.source.isAttacking() && context.source.allowGameAction('assault', context);
    }
}

module.exports = AssaultKeyword;
