const DrawCard = require('../../drawcard.js');

class TheQueensAssassin extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this && event.playingType === 'ambush'
            },
            chooseOpponent: (opponent) => opponent.hand.length < this.controller.hand.length,
            handler: (context) => {
                this.game.promptForSelect(context.opponent, {
                    source: this,
                    cardCondition: (card) =>
                        card.location === 'play area' &&
                        card.controller === context.opponent &&
                        card.getType() === 'character',
                    gameAction: 'kill',
                    onSelect: (p, card) => this.onCardSelected(p, card)
                });

                this.game.addMessage(
                    '{0} uses {1} to force {2} to choose and kill a character',
                    this.controller,
                    this,
                    context.opponent
                );
            }
        });
    }

    onCardSelected(player, card) {
        card.owner.killCharacter(card);

        this.game.addMessage('{0} selected {1} to kill', player, card);

        return true;
    }
}

TheQueensAssassin.code = '01095';

module.exports = TheQueensAssassin;
