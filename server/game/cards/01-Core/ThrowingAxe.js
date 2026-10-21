import DrawCard from '../../drawcard.js';

class ThrowingAxe extends DrawCard {
    // Throwing Axe (01077)
    // Ironborn character only.
    // Reaction: After you win a challenge in which attached character is participating as an
    // attacker, sacrifice Throwing Axe to choose and kill a defending character.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Ironborn' });
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.isAttacking(this.parent)
            },
            limit: ability.limit.perPhase(1),
            cost: ability.costs.sacrificeSelf(),
            target: {
                cardCondition: (card) => card.location === 'play area' && card.isDefending(),
                gameAction: 'kill'
            },
            handler: (context) => {
                context.target.controller.killCharacter(context.target);
                this.game.addMessage(
                    '{0} sacrifices {1} to kill {2}',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }
}

ThrowingAxe.code = '01077';

export default ThrowingAxe;
