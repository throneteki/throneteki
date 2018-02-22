const _ = require('underscore');

const DrawCard = require('../../drawcard.js');

class TheReader extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: event =>
                    event.challenge.winner === this.controller &&
                    event.challenge.isUnopposed() &&
                    _.any(event.challenge.getWinnerCards(), card => card.isFaction('greyjoy') && card.isUnique())
            },
            limit: ability.limit.perPhase(1),
            choices: {
                'Draw 1 card': () => {
                    this.controller.drawCardsToHand(1);
                    this.game.addMessage('{0} uses {1} to draw 1 card', this.controller, this);
                },
                'Discard 3 cards': () => {
                    this.game.addMessage('{0} uses {1} to discard the top 3 cards from each opponent\'s deck', this.controller, this);
                    for(let opponent of this.game.getOpponents(this.controller)) {
                        opponent.discardFromDraw(3);
                    }
                }
            }
        });
    }
}

TheReader.code = '02031';

module.exports = TheReader;
