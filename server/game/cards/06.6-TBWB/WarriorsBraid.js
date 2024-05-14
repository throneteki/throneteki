import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import { Tokens } from '../../Constants/index.js';

class WarriorsBraid extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'targaryen' });
        this.whileAttached({
            effect: [
                ability.effects.addKeyword('renown'),
                ability.effects.dynamicStrength(() => this.tokens[Tokens.bell])
            ]
        });
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.challengeType === 'military' &&
                    event.challenge.winner === this.controller &&
                    event.challenge.isAttacking(this.parent)
            },
            message: '{player} uses {source} to place 1 bell token on {source}',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.placeToken(() => ({ card: this, token: Tokens.bell })),
                    context
                );
            }
        });
    }
}

WarriorsBraid.code = '06114';

export default WarriorsBraid;
