const DrawCard = require('../../drawcard.js');

class HisViperEyes extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.defendingPlayer === this.controller &&
                    event.challenge.loser === this.controller &&
                    ['military', 'power'].includes(event.challenge.challengeType) &&
                    event.challenge.winner.hand.length !== 0
            },
            handler: (context) => {
                this.game.addMessage(
                    "{0} plays {1} to look at {2}'s hand",
                    context.player,
                    this,
                    context.event.challenge.winner
                );
                this.game.promptForSelect(context.player, {
                    activePromptTitle: 'Select a card',
                    source: this,
                    revealTargets: true,
                    cardCondition: (card) =>
                        card.location === 'hand' &&
                        card.controller === context.event.challenge.winner,
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

HisViperEyes.code = '03032';

module.exports = HisViperEyes;
