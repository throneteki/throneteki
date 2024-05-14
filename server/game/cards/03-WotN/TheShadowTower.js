import DrawCard from '../../drawcard.js';

class TheShadowTower extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.defendingPlayer === this.controller
            },
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller === this.game.currentChallenge.loser
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} kneels {1} to make {2} unable to be declared as attacker this phase',
                    this.controller,
                    this,
                    context.target
                );

                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: ability.effects.cannotBeDeclaredAsAttacker()
                }));
            }
        });
    }
}

TheShadowTower.code = '03034';

export default TheShadowTower;
