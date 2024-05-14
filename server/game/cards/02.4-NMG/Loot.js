const DrawCard = require('../../drawcard.js');

class Loot extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    this.controller === event.challenge.winner &&
                    event.challenge.isUnopposed() &&
                    this.getLoserDeckSize(event.challenge) >= 1
            },
            cost: ability.costs.payXGold(
                () => 1,
                (context) => this.getLoserDeckSize(context.event.challenge),
                (context) => context.event.challenge.loser
            ),
            handler: (context) => {
                let opponent = context.event.challenge.loser;
                opponent.discardFromDraw(context.xValue);
                this.game.addMessage(
                    "{0} plays {1} and pays {2} gold from {3}'s gold pool to discard the top {2} cards from {3}'s deck",
                    this.controller,
                    this,
                    context.goldCost,
                    opponent
                );
            }
        });
    }

    getLoserDeckSize(challenge) {
        return challenge.loser.drawDeck.length;
    }
}

Loot.code = '02073';

module.exports = Loot;
