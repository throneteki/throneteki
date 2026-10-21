import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import { Tokens } from '../../Constants/index.js';

class SerJorahMormont extends DrawCard {
    setupCardAbilities() {
        this.stateCheck({
            condition: (context) => context.source.tokens[Tokens.betrayal] >= 3,
            message: '{player} sacrifices {source} as it has 3 or more betrayal tokens',
            gameAction: GameActions.sacrificeCard((context) => ({ card: context.source }))
        });

        this.forcedReaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller && this.isParticipating()
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
