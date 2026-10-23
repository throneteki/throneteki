import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

const strengthWhenSacrificed = (context) => {
    const sacrifice = (context.costEvents || []).find(
        (event) => event.name === 'onSacrificed' && event.card === context.source
    );
    return sacrifice
        ? sacrifice.cardStateWhenSacrificed.getStrength()
        : context.source.getStrength();
};

class RooseBolton extends DrawCard {
    // Roose Bolton (04081)
    // Reaction: After you win a challenge in which Roose Bolton is attacking, choose up to X total
    // STR worth of characters controlled by the losing opponent. X is Roose Bolton's STR. Sacrifice
    // Roose Bolton to kill each of those characters.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player && context.source.isAttacking()
            },
            cost: ability.costs.sacrificeSelf(),
            target: {
                mode: 'maxStat',
                activePromptTitle: 'Select character(s)',
                maxStat: (context) => strengthWhenSacrificed(context),
                cardStat: (card) => card.getStrength(),
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller === context.event.challenge.loser,
                gameAction: 'kill'
            },
            message: '{player} sacrifices {source} to kill {target}',
            gameAction: GameActions.simultaneously((context) =>
                context.target.map((card) => GameActions.kill({ card }))
            )
        });
    }
}

RooseBolton.code = '04081';

export default RooseBolton;
