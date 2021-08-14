import DrawCard from '../../drawcard.js';

class Loot extends DrawCard {
    setupCardAbilities() {
        this.xValue({
            min: () => 1,
            max: (context) => this.getLoserDeckSize(context.event.challenge)
        });

        this.reaction({
            when: {
                afterChallenge: (event) =>
                    this.controller === event.challenge.winner &&
                    event.challenge.isUnopposed() &&
                    this.getLoserDeckSize(event.challenge) >= 1
            },
            handler: (context) => {
                let opponent = context.event.challenge.loser;
                opponent.discardFromDraw(context.xValue);
                this.game.addMessage(
                    "{0} plays {1} and pays {2} gold from {3}'s gold pool to discard the top {2} cards from {3}'s deck",
                    this.controller,
                    this,
                    context.costs.gold,
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

export default Loot;
