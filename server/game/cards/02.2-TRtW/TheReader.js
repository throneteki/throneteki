import DrawCard from '../../drawcard.js';

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
                'Draw 1 card': () => {
                    if (this.controller.canDraw()) {
                        this.controller.drawCardsToHand(1);
                        this.game.addMessage('{0} uses {1} to draw 1 card', this.controller, this);
                    }
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
