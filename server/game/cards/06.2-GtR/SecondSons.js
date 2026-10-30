import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';
import GameActions from '../../GameActions/index.js';

class SecondSons extends DrawCard {
    // Second Sons (06033)
    // Bestow (3).
    // Forced Interrupt: When the challenges phase ends, sacrifice Second Sons unless you discard 1
    // gold from it.
    setupCardAbilities() {
        this.forcedInterrupt({
            when: {
                onPhaseEnded: (event) => event.phase === 'challenge'
            },
            gameAction: GameActions.choose({
                title: (context) => `Discard 1 gold from ${context.source.name}?`,
                choices: {
                    'Discard 1 gold': {
                        condition: (context) => context.source.hasToken(Tokens.gold),
                        message: '{player} is forced to discard a gold from {source}',
                        gameAction: GameActions.discardToken((context) => ({
                            card: context.source,
                            token: Tokens.gold
                        }))
                    },
                    Sacrifice: {
                        message: '{player} is forced by {source} to sacrifice {source}',
                        gameAction: GameActions.sacrificeCard((context) => ({
                            card: context.source
                        }))
                    }
                }
            })
        });
    }
}

SecondSons.code = '06033';

export default SecondSons;
