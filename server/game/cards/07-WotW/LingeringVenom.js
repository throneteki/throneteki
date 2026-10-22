import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import { Tokens } from '../../Constants/index.js';

class LingeringVenom extends DrawCard {
    // Lingering Venom (07032)
    // Terminal.
    // Reaction: After you lose a challenge, place a venom token on Lingering Venom. Then, if
    // attached character's STR is equal to or lower than the number of venom tokens on Lingering
    // Venom, kill it.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) => event.challenge.loser === context.player
            },
            message: '{player} uses {source} to place 1 venom token on {source}',
            gameAction: GameActions.placeToken((context) => ({
                card: context.source,
                token: Tokens.venom
            })).then({
                condition: (context) =>
                    context.source.parent.getStrength() <= context.source.tokens[Tokens.venom],
                message: {
                    format: 'Then {player} uses {source} to kill {parent}',
                    args: { parent: (context) => context.source.parent }
                },
                gameAction: GameActions.kill((context) => ({ card: context.source.parent }))
            })
        });
    }
}

LingeringVenom.code = '07032';

export default LingeringVenom;
