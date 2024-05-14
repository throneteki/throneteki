const DrawCard = require('../../drawcard.js');

class PoisonedCoin extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            max: ability.limit.perChallenge(1),
            when: {
                afterChallenge: (event) =>
                    this.controller === event.challenge.winner &&
                    event.challenge.isUnopposed() &&
                    event.challenge.attackers.some((card) => card.isShadow() && card.isAttacking())
            },
            target: {
                type: 'select',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.controller === this.game.currentChallenge.loser &&
                    card.getType() === 'character' &&
                    !card.isShadow()
            },
            handler: (context) => {
                this.atEndOfPhase((ability) => ({
                    match: context.target,
                    effect: ability.effects.poison
                }));
            }
        });
    }
}

PoisonedCoin.code = '11078';

module.exports = PoisonedCoin;
