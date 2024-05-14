const DrawCard = require('../../drawcard.js');

class SeenInFlames extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: "Look at opponent's hand",
            phase: 'challenge',
            condition: () =>
                this.controller.anyCardsInPlay(
                    (card) => card.hasTrait("R'hllor") && card.getType() === 'character'
                ),
            chooseOpponent: (opponent) => opponent.hand.length !== 0,
            handler: (context) => {
                this.game.addMessage(
                    "{0} plays {1} to look at {2}'s hand",
                    context.player,
                    this,
                    context.opponent
                );
                this.game.promptForSelect(context.player, {
                    activePromptTitle: 'Select a card',
                    source: this,
                    revealTargets: true,
                    cardCondition: (card) =>
                        card.location === 'hand' && card.controller === context.opponent,
                    onSelect: (player, card) => this.onCardSelected(player, card)
                });
            }
        });
    }

    onCardSelected(player, card) {
        let otherPlayer = card.controller;
        otherPlayer.discardCard(card);
        this.game.addMessage(
            "{0} then uses {1} to discard {2} from {3}'s hand",
            player,
            this,
            card,
            otherPlayer
        );

        return true;
    }
}

SeenInFlames.code = '01064';

module.exports = SeenInFlames;
