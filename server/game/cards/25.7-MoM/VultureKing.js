const DrawCard = require('../../drawcard.js');

class VultureKing extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addKeyword('pillage')
        });
        this.reaction({
            when: {
                onCardDiscarded: event => event.isPillage && event.source === this.parent && ['attachment', 'location'].includes(event.card.getType())
            },
            target: {
                cardCondition: card => card.location === 'play area' && card.getType() === 'character'
            },
            message: '{player} uses {source} to have {target} lose a power icon until the end of the phase',
            handler: context => {
                this.untilEndOfPhase(ability => ({
                    match: context.target,
                    effect: ability.effects.removeIcon('power')
                }));
            }
        });
    }
}

VultureKing.code = '25546';
VultureKing.version = '1.1';

module.exports = VultureKing;
