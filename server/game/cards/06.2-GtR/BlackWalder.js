import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';

class BlackWalder extends DrawCard {
    // Black Walder (06037)
    // Bestow (3).
    // During the third challenge you initiate each phase, Black Walder gains renown and gets +2 STR
    // for each gold he has.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                context.game.isDuringChallenge({
                    attackingPlayer: context.source.controller,
                    number: 3
                }),
            match: this,
            effect: [
                ability.effects.addKeyword('Renown'),
                ability.effects.dynamicStrength(
                    (card, context) => context.source.tokens[Tokens.gold] * 2
                )
            ]
        });
    }
}

BlackWalder.code = '06037';

export default BlackWalder;
