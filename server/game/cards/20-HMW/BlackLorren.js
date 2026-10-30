import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BlackLorren extends DrawCard {
    // Black Lorren (20006)
    // Bestow (1).
    // Reaction: After you win a challenge in which Black Lorren is attacking, discard 1 gold from
    // an attacking Raider character to choose and kill a defending character.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    context.source.isAttacking() &&
                    event.challenge.defenders.length >= 1
            },
            cost: ability.costs.discardGoldFromCard(
                1,
                (card, context) =>
                    card.getType() === 'character' &&
                    card.hasTrait('Raider') &&
                    card.controller === context.source.controller &&
                    card.isAttacking()
            ),
            target: {
                cardCondition: (card) => card.isDefending()
            },
            message: '{player} discards 1 gold from {costs.discardToken} to kill {target}',
            gameAction: GameActions.kill((context) => ({ card: context.target }))
        });
    }
}

BlackLorren.code = '20006';

export default BlackLorren;
