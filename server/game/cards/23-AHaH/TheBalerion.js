const DrawCard = require('../../drawcard.js');

class TheBalerion extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.name === 'Captain Groleo' && card.controller === this.controller,
            effect: [
                ability.effects.addIcon('power'),
                ability.effects.addKeyword('stealth')
            ]
        });
        this.action({
            title: 'Kneel and shuffle into deck',
            cost: [
                ability.costs.kneelSelf(),
                ability.costs.shuffleSelfIntoDeck()
            ],
            target: {
                cardCondition: { faction: 'targaryen', type: 'character', location: 'play area' }
            },
            phase: 'challenge',
            message: '{player} kneels {source} and shuffles it into their deck to give {target} +2 STR and assault until the end of the phase',
            handler: context => {
                this.untilEndOfPhase(ability => ({
                    match: context.target,
                    effect: [
                        ability.effects.modifyStrength(2),
                        ability.effects.addKeyword('assault')
                    ]
                }));
            } 
        });
    }
}

TheBalerion.code = '23014';

module.exports = TheBalerion;
