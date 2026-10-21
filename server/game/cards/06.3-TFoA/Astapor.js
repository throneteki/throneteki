import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';

class Astapor extends DrawCard {
    // Astapor (06054)
    // Bestow (4).
    // Action: Kneel Astapor to choose a participating character. Until the end of the challenge,
    // that character gets -X STR. X is the number of gold Astapor has.
    setupCardAbilities(ability) {
        this.action({
            title: 'Give character -STR',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isParticipating(),
                gameAction: 'decreaseStrength'
            },
            message: {
                format: '{player} kneels {source} to give {target} -{value1} STR until the end of the challenge',
                args: { value1: (context) => context.source.tokens[Tokens.gold] }
            },
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfChallenge',
                match: context.target,
                effect: ability.effects.modifyStrength(-context.source.tokens[Tokens.gold])
            }))
        });
    }
}

Astapor.code = '06054';

export default Astapor;
