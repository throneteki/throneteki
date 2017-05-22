const DrawCard = require('../../../drawcard.js');

class OursIsTheOldWay extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Characters gain or lose stealth',
            choices: {
                'Gain stealth': () => {
                    this.untilEndOfPhase(ability => ({
                        match: card => card.isFaction('greyjoy') && card.getType() === 'character' && card.controller === this.controller,
                        effect: ability.effects.addKeyword('stealth')
                    }));

                    this.game.addMessage('{0} plays {1} to have each {2} character they control gain stealth until the end of the phase', 
                                          this.controller, this, 'greyjoy');
                },
                'Lose stealth': () => {
                    this.untilEndOfPhase(ability => ({
                        match: card => !card.isFaction('greyjoy') && card.getType() === 'character',
                        effect: ability.effects.removeKeyword('stealth')
                    }));

                    this.game.addMessage('{0} plays {1} to have each non-{2} character lose stealth until the end of the phase', 
                                          this.controller, this, 'greyjoy');
                }
            }
        });
    }
}

OursIsTheOldWay.code = '04032';

module.exports = OursIsTheOldWay;
