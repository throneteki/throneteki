import { Tokens } from '../../Constants/index.js';
import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class TearsOfLys extends DrawCard {
    // Tears of Lys (01044)
    // Reaction: After you win an [intrigue] challenge as the attacking player, place a poison token
    // on a character without an [intrigue] icon controlled by the losing opponent. At the end of
    // the phase, if that character still has the poison token, remove it and kill that character.
    // (Max 1 per challenge.)
    setupCardAbilities(ability) {
        this.reaction({
            max: ability.limit.perChallenge(1),
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.attackingPlayer === context.source.controller &&
                    event.challenge.winner === context.source.controller &&
                    event.challenge.challengeType === 'intrigue'
            },
            target: {
                type: 'select',
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.game.currentChallenge.loser &&
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

TearsOfLys.code = '01044';

export default TearsOfLys;
