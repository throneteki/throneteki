import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class OursIsTheFury extends DrawCard {
    // Ours is the Fury (01063)
    // Play only during a challenge in which you are the defending player.
    // Action: Choose a kneeling [baratheon] character you control. That character is now
    // participating as a defender. If you win this challenge, stand that character.
    setupCardAbilities() {
        this.action({
            title: 'Add knelt Baratheon as defender',
            condition: (context) =>
                context.game.isDuringChallenge({ defendingPlayer: context.player }),
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.kneeled &&
                    card.controller === context.player &&
                    card.isFaction('baratheon') &&
                    card.canParticipateInChallenge()
            },
            message: '{player} plays {source} to add {target} to the challenge as a defender',
            gameAction: GameActions.simultaneously([
                GameActions.addToChallenge((context) => ({ card: context.target })),
                GameActions.delayedEffect({
                    duration: 'untilEndOfChallenge',
                    when: {
                        afterChallenge: (event, context) =>
                            event.challenge.winner === context.player
                    },
                    message: '{player} stands {target} because of {source}',
                    gameAction: GameActions.standCard((context) => ({ card: context.target }))
                })
            ])
        });
    }
}

OursIsTheFury.code = '01063';

export default OursIsTheFury;
