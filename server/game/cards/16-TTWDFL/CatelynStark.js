import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class CatelynStark extends DrawCard {
    // Catelyn Stark (16011)
    // Action: During an [intrigue] or [power] challenge in which you are the defending player, put
    // Catelyn Stark into play from your hand knelt, participating as a defender. At the end of the
    // phase, if Catelyn Stark is still in play, return her to your hand.
    setupCardAbilities(ability) {
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
                    GameActions.lastingEffect((context) => ({
                        duration: 'atEndOfPhase',
                        match: context.source,
                        condition: () => context.source.location === 'play area',
                        effect: ability.effects.returnToHandIfStillInPlay(true)
                    }))
                ])
            })
        });
    }
}

CatelynStark.code = '16011';

export default CatelynStark;
