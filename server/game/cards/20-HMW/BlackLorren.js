import DrawCard from '../../drawcard.js';

class BlackLorren extends DrawCard {
    // Black Lorren (20006)
    // Bestow (1).
    // Reaction: After you win a challenge in which Black Lorren is attacking, discard 1 gold from
    // an attacking Raider character to choose and kill a defending character.
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
