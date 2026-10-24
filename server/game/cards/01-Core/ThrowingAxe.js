import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ThrowingAxe extends DrawCard {
    // Throwing Axe (01077)
    // Ironborn character only.
    // Reaction: After you win a challenge in which attached character is participating as an
    // attacker, sacrifice Throwing Axe to choose and kill a defending character.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Ironborn' });
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    event.challenge.isAttacking(context.source.parent)
            },
            limit: ability.limit.perPhase(1),
            cost: ability.costs.sacrificeSelf(),
            target: {
                cardCondition: (card) => card.location === 'play area' && card.isDefending(),
                gameAction: 'kill'
            },
            message: '{player} sacrifices {source} to kill {target}',
            gameAction: GameActions.kill((context) => ({ card: context.target }))
        });
    }
}

ThrowingAxe.code = '01077';

export default ThrowingAxe;
