import DrawCard from '../../drawcard.js';

class Viserion extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller && this.isAttacking()
            },
            cost: [ability.costs.discardFromHand()],
            message: {
                format: '{player} discards {discardCost} to have {source} gain intimidate until the end of the challenge',
                args: {
                    discardCost: (context) => context.costs.discardFromHand
                }
            },
            handler: (context) => {
                this.untilEndOfChallenge((ability) => ({
                    match: context.this,
                    effect: [ability.effects.addKeyword('Intimidate')]
                }));
            }
        });
    }
}

Viserion.code = '13013';

export default Viserion;
