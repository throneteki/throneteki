const DrawCard = require('../../../drawcard.js');

class VenomousBlade extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.modifyStrength(1)
        });
        //TODO: uses target API but doesn't 'target' per the game rules (doesn't use the word choose)
        this.reaction({
            when: {
                onCardEntersPlay: event => event.card === this
            },
            target: {
                activePromptTitle: 'Select a character',
                cardCondition: card => card.location === 'play area' && card.getType() === 'character' && card.getPrintedStrength() <= 2
            },
            handler: context => {
                this.atEndOfPhase(ability => ({
                    match: context.target,
                    effect: ability.effects.poison
                }));
            }
        });
    }

    canAttach(player, card) {
        if(card.getType() !== 'character' || !card.isFaction('martell') || card.controller !== this.controller) {
            return false;
        }

        return super.canAttach(player, card);
    }
}

VenomousBlade.code = '04036';

module.exports = VenomousBlade;
