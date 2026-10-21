import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import { Tokens } from '../../Constants/index.js';

class SerJorahMormont extends DrawCard {
    // Ser Jorah Mormont (01165)
    // Renown.
    // If Ser Jorah Mormont has 3 or more betrayal tokens on him, sacrifice him.
    // Forced Reaction: After you win a challenge in which Ser Jorah Mormont is participating, place
    // 1 betrayal token on him.
    setupCardAbilities() {
        this.stateCheck({
            condition: (context) => context.source.tokens[Tokens.betrayal] >= 3,
            message: '{player} sacrifices {source} as it has 3 or more betrayal tokens',
            gameAction: GameActions.sacrificeCard((context) => ({ card: context.source }))
        });

        this.forcedReaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player && context.source.isParticipating()
            },
            message: '{player} is forced to place 1 betrayal token on {source}',
            gameAction: GameActions.placeToken((context) => ({
                card: context.source,
                token: Tokens.betrayal
            }))
        });
    }
}

SerJorahMormont.code = '01165';

export default SerJorahMormont;
