import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import { Tokens } from '../../Constants/index.js';

class WarriorsBraid extends DrawCard {
    // Warrior's Braid (06114)
    // [targaryen] character only.
    // Attached character gains renown, and gets +1 STR for each bell token on Warrior's Braid.
    // Reaction: After you win a [military] challenge in which attached character is attacking,
    // place a bell token on Warrior's Braid.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'targaryen' });
        this.whileAttached({
            effect: [
                ability.effects.addKeyword('renown'),
                ability.effects.dynamicStrength(
                    (card, context) => context.source.tokens[Tokens.bell]
                )
            ]
        });
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.challengeType === 'military' &&
                    event.challenge.winner === context.source.controller &&
                    event.challenge.isAttacking(context.source.parent)
            },
            message: '{player} uses {source} to place 1 bell token on {source}',
            gameAction: GameActions.placeToken((context) => ({
                card: context.source,
                token: Tokens.bell
            }))
        });
    }
}

WarriorsBraid.code = '06114';

export default WarriorsBraid;
