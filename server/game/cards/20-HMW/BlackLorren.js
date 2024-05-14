import DrawCard from '../../drawcard.js';

class BlackLorren extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    this.isAttacking() &&
                    event.challenge.defenders.length >= 1
            },
            cost: ability.costs.discardGoldFromCard(
                1,
                (card) =>
                    card.getType() === 'character' &&
                    card.hasTrait('Raider') &&
                    card.controller === this.controller &&
                    card.isAttacking()
            ),
            target: {
                cardCondition: (card) => card.isDefending()
            },
            handler: (context) => {
                this.game.killCharacter(context.target);
                this.game.addMessage(
                    '{0} discards 1 gold from {1} to kill {2}',
                    context.player,
                    context.costs.discardToken,
                    context.target
                );

                return true;
            }
        });
    }
}

BlackLorren.code = '20006';

export default BlackLorren;
