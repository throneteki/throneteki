import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import { Tokens } from '../../Constants/index.js';

class ChellaDaughterOfCheyk extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.dynamicStrength(() => this.tokens[Tokens.ear])
        });

        this.persistentEffect({
            condition: () => this.tokens[Tokens.ear] >= 3,
            match: this,
            effect: [ability.effects.addKeyword('Intimidate'), ability.effects.addKeyword('Renown')]
        });

        this.reaction({
            when: {
                onCharacterKilled: (event) => this.isAttacking() && event.card !== this
            },
            message: '{player} uses {source} to place 1 ear token to {source}',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.placeToken(() => ({ card: this, token: Tokens.ear })),
                    context
                );
            }
        });
    }
}

ChellaDaughterOfCheyk.code = '05007';

export default ChellaDaughterOfCheyk;
