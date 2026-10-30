import { Tokens } from '../../Constants/index.js';
import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class TyeneSand extends DrawCard {
    // Tyene Sand (02115)
    // Reaction: After you win an [intrigue] challenge in which Tyene Sand is participating as an
    // attacker, place a poison token on a character without an [intrigue] icon. At the end of the
    // phase, if that character still has the poison token, remove it and kill that character.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.challengeType === 'intrigue' &&
                    event.challenge.winner === context.source.controller &&
                    context.source.isAttacking()
            },
            target: {
                type: 'select',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    !card.hasIcon('intrigue')
            },
            gameAction: GameActions.simultaneously([
                GameActions.placeToken((context) => ({
                    card: context.target,
                    token: Tokens.poison
                })),
                GameActions.delayedEffect((context) => {
                    const card = context.target;
                    return {
                        duration: 'untilTriggered',
                        title: card.name,
                        when: { onAtEndOfPhase: () => true },
                        until: { onCardLeftPlay: (event) => event.card === card },
                        gameAction: GameActions.ifCondition({
                            condition: () =>
                                card.location === 'play area' && card.hasToken(Tokens.poison),
                            thenAction: {
                                message:
                                    '{player} resolves the delayed effect from {source}: {gameAction}',
                                gameAction: GameActions.simultaneously([
                                    GameActions.discardToken({ card, token: Tokens.poison }),
                                    GameActions.kill({ card })
                                ])
                            }
                        })
                    };
                })
            ])
        });
    }
}

TyeneSand.code = '02115';

export default TyeneSand;
