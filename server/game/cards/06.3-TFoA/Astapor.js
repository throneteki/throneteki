import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';

class Astapor extends DrawCard {
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
            handler: (context) => {
                this.untilEndOfChallenge((ability) => ({
                    match: context.target,
                    effect: ability.effects.modifyStrength(-this.tokens[Tokens.gold])
                }));

                this.game.addMessage(
                    '{0} kneels {1} to give {2} -{3} STR until the end of the challenge',
                    context.player,
                    this,
                    context.target,
                    this.tokens[Tokens.gold]
                );
            }
        });
    }
}

Astapor.code = '06054';

export default Astapor;
