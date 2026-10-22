import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';
import GameActions from '../../GameActions/index.js';

class FickleBannerman extends DrawCard {
    // Fickle Bannerman (06007)
    // Bestow (2). Renown.
    // Forced Reaction: After you lose a [power] challenge, the winning opponent takes control of
    // Fickle Bannerman unless you discard 1 gold from it.
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.loser === context.player &&
                    event.challenge.challengeType === 'power'
            },
            gameAction: GameActions.ifCondition({
                condition: (context) => context.source.hasToken(Tokens.gold),
                thenAction: GameActions.choose({
                    title: (context) => `Discard a gold from ${context.source.name}?`,
                    choices: {
                        Yes: {
                            message: '{player} is forced to discard a gold from {source}',
                            gameAction: GameActions.discardToken((context) => ({
                                card: context.source,
                                token: Tokens.gold
                            }))
                        },
                        No: loseControl()
                    }
                }),
                elseAction: loseControl()
            })
        });
    }
}

function loseControl() {
    return {
        message: {
            format: '{winner} takes control of {source}',
            args: { winner: (context) => context.event.challenge.winner }
        },
        gameAction: GameActions.takeControl((context) => ({
            player: context.event.challenge.winner,
            card: context.source
        }))
    };
}

FickleBannerman.code = '06007';

export default FickleBannerman;
