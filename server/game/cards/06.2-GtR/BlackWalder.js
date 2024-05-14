import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';

class BlackWalder extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                this.game.isDuringChallenge({ attackingPlayer: this.controller, number: 3 }),
            match: this,
            effect: [
                ability.effects.addKeyword('Renown'),
                ability.effects.dynamicStrength(() => this.tokens[Tokens.gold] * 2)
            ]
        });
    }
}

BlackWalder.code = '06037';

export default BlackWalder;
