import DrawCard from '../../drawcard.js';

class TheQueensAssassin extends DrawCard {
    // The Queen's Assassin (01095)
    // Ambush (4).
    // Reaction: After The Queen's Assassin enters play using ambush, choose an opponent. If you
    // have more cards in hand than that player, he or she must choose and kill a character he or
    // she controls.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this && event.playingType === 'ambush'
            },
            chooseOpponent: (opponent) => opponent.getHandCount() < this.controller.getHandCount(),
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

export default TheQueensAssassin;
