const DrawCard = require('../../../drawcard.js');

class WinterfellCrypt extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onSacrificed: event => this.triggerCondition(event),
                onCharacterKilled: event => this.triggerCondition(event)
            },
            cost: ability.costs.sacrificeSelf(),
            target: {
                activePromptTitle: 'Select a character',
                cardCondition: (card, context) => card.location === 'play area' && card.getType() === 'character' &&
                                                  card.getPrintedStrength() <= context.event.card.getPrintedStrength()
                                                  
            },
            handler: context => {
                this.untilEndOfPhase(ability => ({
                    match: context.target,
                    effect: ability.effects.shuffleIntoDeckIfStillInPlay()
                }));

                this.game.addMessage('{0} sacrifices {1} to choose {2}', this.controller, this, context.target);
            }
        });
    }

    triggerCondition(event) {
        return (event.card.controller === this.controller && event.card.isUnique() && event.card.isFaction('stark') &&
                event.card.getType() === 'character' && this.game.currentPhase === 'challenge');
    }
}

WinterfellCrypt.code = '02082';

module.exports = WinterfellCrypt;
