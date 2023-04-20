const KeywordAbility = require('./KeywordAbility.js');
const BypassByStealth = require('./GameActions/BypassByStealth.js');

class StealthKeyword extends KeywordAbility {
    constructor() {
        super('Stealth', {
            target: {
                activePromptTitle: context => this.defaultTargetPromptTitle(context),
                numCards: context => this.getTriggerAmount(context),
                cardCondition: (card, context) => this.canStealth(card, context.challenge),
                gameAction: 'bypassByStealth'
            },
            message: {
                format: '{player} uses {source} to bypass {targets} using stealth',
                args: { targets: context => context.targets.getTargets() }
            },
            handler: context => {
                context.targets.getTargets().forEach(target => {
                    let props = { challenge: context.challenge, source: context.source, target };
                    context.challenge.addInitiationAction(BypassByStealth, props);
                });
            }
        });
    }
    
    canStealth(card, challenge) {
        return !card.isStealth() 
            && card.controller === challenge.defendingPlayer
            && card.location === 'play area'
            && card.getType() === 'character';
    }

    meetsRequirements(context) {
        return context.source.isAttacking();
    }
}

module.exports = StealthKeyword;
