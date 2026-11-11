import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

const topDrownedGod = (player) =>
    player.deadPile
        .filter((card) => card.getType() === 'character' && card.hasTrait('Drowned God'))
        .at(-1);

class OldWyk extends DrawCard {
    // Old Wyk (05028)
    // Reaction: After you initiate a [power] challenge, kneel Old Wyk to put the top Drowned God
    // character in your dead pile into play knelt, participating as an attacker. Then, if you win
    // the challenge by 5 or more STR, return that character to your hand. Otherwise, place it on
    // the bottom of your deck.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onChallengeInitiated: (event, context) =>
                    event.challenge.attackingPlayer === context.player &&
                    event.challenge.initiatedChallengeType === 'power' &&
                    !!topDrownedGod(context.player)
            },
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {source} to put {card} into play from their dead pile knelt, participating as an attacker',
                args: { card: (context) => topDrownedGod(context.player) }
            },
            gameAction: GameActions.simultaneously((context) => {
                const card = topDrownedGod(context.player);
                return [
                    GameActions.putIntoPlay({ card, player: context.player, kneeled: true }).then({
                        gameAction: GameActions.simultaneously([
                            GameActions.addToChallenge({ card }),
                            GameActions.delayedEffect({
                                duration: 'untilEndOfChallenge',
                                when: { afterChallenge: () => true },
                                gameAction: GameActions.ifCondition({
                                    condition: () => card.location === 'play area',
                                    thenAction: GameActions.ifCondition({
                                        condition: (context) =>
                                            context.event.challenge.winner === context.player &&
                                            context.event.challenge.strengthDifference >= 5,
                                        thenAction: {
                                            message: {
                                                format: '{player} returns {card} to their hand for {source}',
                                                args: { card: () => card }
                                            },
                                            gameAction: GameActions.returnCardToHand({ card })
                                        },
                                        elseAction: {
                                            message: {
                                                format: '{player} places {card} on the bottom of their deck for {source}',
                                                args: { card: () => card }
                                            },
                                            gameAction: GameActions.returnCardToDeck({
                                                card,
                                                bottom: true
                                            })
                                        }
                                    })
                                })
                            })
                        ])
                    })
                ];
            })
        });
    }
}

OldWyk.code = '05028';

export default OldWyk;
