const DrawCard = require('../../../drawcard.js');

class WinterfellCrypt extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onSacrificed: (event, player, card) => {
                    if(this.uniqueStarkCharacterSacrificedOrKilled(event, card)) {
                        this.triggerCard = card;
                        return true;
                    }

                    return false;
                },
                onCharacterKilled: event => {
                    if(this.uniqueStarkCharacterSacrificedOrKilled(event, event.card)) {
                        this.triggerCard = event.card;
                        return true;
                    }

                    return false;
                }
            },
            cost: ability.costs.sacrificeSelf(),
            target: {
                activePromptTitle: 'Select a character',
                cardCondition: card => (
                    card.location === 'play area' && 
                    card.getStrength(true) <= this.triggerCard.getStrength(true) &&
                    card.getType() === 'character')
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

    uniqueStarkCharacterSacrificedOrKilled(event, card) {
        return (
            this.controller === card.controller &&
            card.isUnique() &&
            card.isFaction('stark') &&
            card.getType() === 'character'
        );
    }
}

WinterfellCrypt.code = '02082';

module.exports = WinterfellCrypt;
