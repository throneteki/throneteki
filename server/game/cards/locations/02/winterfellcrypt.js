const DrawCard = require('../../../drawcard.js');

class WinterfellCrypt extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onSacrificed: (event, player, card) => {
                    if(this.uniqueStarkCharacterSacrificedOrKilledDuringChallenges(event, card)) {
                        this.triggerCard = card;
                        return true;
                    }

                    return false;
                },
                onCharacterKilled: event => {
                    if(this.uniqueStarkCharacterSacrificedOrKilledDuringChallenges(event, event.card)) {
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
                    card.getPrintedStrength() <= this.triggerCard.getPrintedStrength() &&
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

    uniqueStarkCharacterSacrificedOrKilledDuringChallenges(event, card) {
        return (
            this.controller === card.controller &&
            card.isUnique() &&
            card.isFaction('stark') &&
            card.getType() === 'character' &&
            this.game.currentPhase === 'challenge'
        );
    }
}

WinterfellCrypt.code = '02082';

module.exports = WinterfellCrypt;
