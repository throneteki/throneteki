const DrawCard = require('../../drawcard.js');

class PassingTheBlackGate extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Reduce Stark characters',
            phase: 'marshal',
            cost: ability.costs.kneelFactionCard(),
            handler: () => {
                this.untilEndOfPhase((ability) => ({
                    effect: ability.effects.reduceCost({
                        playingTypes: 'marshal',
                        amount: 1,
                        match: (card) => card.isFaction('stark') && card.getType() === 'character'
                    })
                }));

                this.game.addMessage(
                    '{0} plays {1} and kneels their faction card to reduce the cost of each {2} character they marshal this phase by 1',
                    this.controller,
                    this,
                    'stark'
                );
            }
        });
    }
}

PassingTheBlackGate.code = '06082';

module.exports = PassingTheBlackGate;
