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
                'Discard 3 cards': () => {
                    this.game.addMessage(
                        "{0} uses {1} to discard the top 3 cards from each opponent's deck",
                        this.controller,
                        this
                    );
                    for (let opponent of this.game.getOpponents(this.controller)) {
                        opponent.discardFromDraw(3);
                    }
                }
            }
        });
    }
}

TheReader.code = '02031';

export default TheReader;
