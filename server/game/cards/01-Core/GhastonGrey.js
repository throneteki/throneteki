import DrawCard from '../../drawcard.js';

class GhastonGrey extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.loser === this.controller &&
                    event.challenge.defendingPlayer === this.controller
            },
            cost: [ability.costs.kneelSelf(), ability.costs.sacrificeSelf()],
            target: {
                type: 'select',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isAttacking()
            },
            handler: (context) => {
                context.target.owner.returnCardToHand(context.target, false);
                this.game.addMessage(
                    "{0} kneels and sacrifices {1} to return {2} to {3}'s hand",
                    context.player,
                    this,
                    context.target,
                    context.target.owner
                );
            }
        });
    }
}

GhastonGrey.code = '01116';

export default GhastonGrey;
