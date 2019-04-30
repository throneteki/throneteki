const DrawCard = require('../../drawcard');

class TheFowlerTwins extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Force participant',
            target: {
                cardCondition: card => card.location === 'play area' && card.getType() === 'character'
            },
            message: '{player} uses {source} to force {target} to be declared as a participant in the next challenge',
            handler: context => {
                this.lastingEffect(ability => ({
                    until: {
                        afterChallenge: () => true,
                        onPhaseEnd: () => true
                    },
                    match: context.target,
                    effect: [
                        ability.effects.mustBeDeclaredAsAttacker(),
                        ability.effects.mustBeDeclaredAsDefender()
                    ]
                }));
            }
        });
    }
}

TheFowlerTwins.code = '13035';

module.exports = TheFowlerTwins;
