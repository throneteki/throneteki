import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class DolorousEdd extends DrawCard {
    // Dolorous Edd (04025)
    // Action: During an [intrigue] challenge in which you are the defending player, kneel your
    // faction card to put Dolorous Edd into play from your hand knelt, participating as a defender.
    // If you win the challenge, you may return him to your hand.
    setupCardAbilities(ability) {
        this.action({
            title: 'Add as a defender',
            location: 'hand',
            condition: (context) =>
                context.game.isDuringChallenge({
                    challengeType: 'intrigue',
                    defendingPlayer: context.player
                }) && context.player.canPutIntoPlay(context.source),
            cost: ability.costs.kneelFactionCard(),
            message: '{player} kneels their faction card to put {source} into play as a defender',
            gameAction: GameActions.putIntoPlay((context) => ({
                card: context.source,
                kneeled: true
            })).then({
                gameAction: GameActions.simultaneously([
                    GameActions.addToChallenge((context) => ({ card: context.source })),
                    GameActions.delayedEffect({
                        duration: 'untilEndOfChallenge',
                        when: {
                            afterChallenge: (event, context) =>
                                event.challenge.winner === context.player &&
                                context.source.location === 'play area'
                        },
                        gameAction: GameActions.may({
                            title: 'Return Dolorous Edd to your hand?',
                            message:
                                '{player} returns {source} to their hand after winning the challenge',
                            gameAction: GameActions.returnCardToHand((context) => ({
                                card: context.source
                            }))
                        })
                    })
                ])
            })
        });
    }
}

DolorousEdd.code = '04025';

export default DolorousEdd;
