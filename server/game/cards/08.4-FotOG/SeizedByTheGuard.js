import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';
import GameActions from '../../GameActions/index.js';

class SeizedByTheGuard extends DrawCard {
    // Seized by the Guard (08078)
    // Non-limited location only. Bestow (4). Terminal.
    // Treat attached location as if its printed text box were blank (except for Traits).
    // Forced Reaction: After the marshaling phase begins, sacrifice Seized by the Guard unless you
    // discard 1 gold from it.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ type: 'location', limited: false });
        this.whileAttached({
            effect: ability.effects.blankExcludingTraits
        });
        this.forcedReaction({
            when: {
                onPhaseStarted: (event) => event.phase === 'marshal'
            },
            gameAction: GameActions.ifCondition({
                condition: (context) => context.source.hasToken(Tokens.gold),
                thenAction: GameActions.choose({
                    title: (context) => `Discard 1 gold from ${context.source.name}?`,
                    choices: {
                        Yes: {
                            message: '{player} is forced to discard 1 gold from {source}',
                            gameAction: GameActions.discardToken((context) => ({
                                card: context.source,
                                token: Tokens.gold
                            }))
                        },
                        No: sacrificeSelf()
                    }
                }),
                elseAction: sacrificeSelf()
            })
        });
    }
}

function sacrificeSelf() {
    return {
        message: '{player} is forced to sacrifice {source}',
        gameAction: GameActions.sacrificeCard((context) => ({ card: context.source }))
    };
}

SeizedByTheGuard.code = '08078';

export default SeizedByTheGuard;
