import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class CatelynStark extends DrawCard {
    // Catelyn Stark (16011)
    // Action: During an [intrigue] or [power] challenge in which you are the defending player, put
    // Catelyn Stark into play from your hand knelt, participating as a defender. At the end of the
    // phase, if Catelyn Stark is still in play, return her to your hand.
    setupCardAbilities() {
        this.action({
            title: 'Add as a defender',
            location: 'hand',
            condition: (context) =>
                context.game.isDuringChallenge({
                    challengeType: ['intrigue', 'power'],
                    defendingPlayer: context.player
                }) && context.player.canPutIntoPlay(context.source),
            message: '{player} puts {source} into play as a defender',
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.source,
                kneeled: true
            })).then({
                gameAction: GameActions.simultaneously([
                    GameActions.addToChallenge((context) => ({ card: context.source })),
                    GameActions.delayedEffect((context) => {
                        const card = context.source;
                        return {
                            duration: 'untilTriggered',
                            title: card.name,
                            when: { onAtEndOfPhase: () => true },
                            until: { onCardLeftPlay: (event) => event.card === card },
                            gameAction: GameActions.ifCondition({
                                condition: () => ['play area', 'duplicate'].includes(card.location),
                                thenAction: {
                                    message:
                                        '{player} resolves the delayed effect from {source}: {gameAction}',
                                    gameAction: GameActions.returnCardToHand({
                                        card,
                                        allowSave: true
                                    })
                                }
                            })
                        };
                    })
                ])
            })
        });
    }
}

CatelynStark.code = '16011';

export default CatelynStark;
