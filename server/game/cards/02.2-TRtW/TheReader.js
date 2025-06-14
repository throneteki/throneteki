import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheReader extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.isUnopposed() &&
                    event.challenge
                        .getWinnerCards()
                        .some((card) => card.isFaction('greyjoy') && card.isUnique())
            },
            limit: ability.limit.perPhase(1),
            choices: {
                'Draw 1 card': {
                    message: '{player} uses {source} to draw 1 card',
                    gameAction: GameActions.drawCards((context) => ({
                        player: context.player,
                        amount: 1
                    }))
                },
                'Discard 3 cards': {
                    message:
                        "{player} uses {source} to discard the top 3 cards from each opponent's deck",
                    gameAction: GameActions.simultaneously((context) =>
                        this.game.getOpponents(context.player).map((opponent) =>
                            GameActions.discardTopCards({
                                player: opponent,
                                amount: 3,
                                source: context.source
                            }).thenExecute((event) => {
                                this.game.addMessage('{player} discards {topCards}', event);
                            })
                        )
                    )
                }
            }
        });
    }
}

TheReader.code = '02031';

export default TheReader;
