import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BoltonLoyalist extends DrawCard {
    // Bolton Loyalist (25091)
    // Forced Reaction: After you lose an [intrigue] challenge, give control of Bolton Loyalist to
    // the winning opponent unless you sacrifice another character.
    setupCardAbilities() {
        this.forcedReaction({
            cannotBeCanceled: true,
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.isMatch({ loser: context.player, challengeType: 'intrigue' })
            },
            message: {
                format: '{player} is forced to give control of {source} to {winner}, or sacrifice another character they control',
                args: { winner: (context) => context.event.challenge.winner }
            },
            gameAction: GameActions.choose({
                choices: {
                    'Give Control': {
                        message: {
                            format: '{player} gives control of {source} to {winner}',
                            args: { winner: (context) => context.event.challenge.winner }
                        },
                        gameAction: GameActions.takeControl((context) => ({
                            card: context.source,
                            player: context.event.challenge.winner,
                            context
                        }))
                    },
                    'Sacrifice Character': {
                        message: '{player} chooses to sacrifice another character',
                        gameAction: GameActions.chooseCards({
                            title: 'Select a character',
                            cardCondition: (card, context) =>
                                card.getType() === 'character' &&
                                card.location === 'play area' &&
                                card !== context.source &&
                                card.controller === context.player,
                            gameAction: (card) => GameActions.sacrificeCard({ card })
                        })
                    }
                }
            })
        });
    }
}

BoltonLoyalist.code = '25091';

export default BoltonLoyalist;
