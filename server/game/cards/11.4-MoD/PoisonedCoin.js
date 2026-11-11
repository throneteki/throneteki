import { Tokens } from '../../Constants/index.js';
import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class PoisonedCoin extends DrawCard {
    // Poisoned Coin (11078)
    // Shadow (0).
    // Reaction: After you win an unopposed challenge in which you control an attacking character
    // with shadow, place a poison token on a character without shadow controlled by the losing
    // opponent. At the end of the phase, if that character still has that poison token, remove it
    // and kill that character. (Max 1 per challenge.)
    setupCardAbilities(ability) {
        this.reaction({
            max: ability.limit.perChallenge(1),
            when: {
                afterChallenge: (event, context) =>
                    context.source.controller === event.challenge.winner &&
                    event.challenge.isUnopposed() &&
                    event.challenge.attackers.some((card) => card.isShadow() && card.isAttacking())
            },
            target: {
                type: 'select',
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.game.currentChallenge.loser &&
                    card.getType() === 'character' &&
                    !card.isShadow()
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

PoisonedCoin.code = '11078';

export default PoisonedCoin;
