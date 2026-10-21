import DrawCard from '../../drawcard.js';

class TheHound extends DrawCard {
    // The Hound (02009)
    // Ambush (4).
    // Forced Reaction: After you win a challenge in which The Hound is participating, you may
    // discard 1 card at random from your hand. If you do not, return The Hound to your hand.
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller && this.isParticipating()
            },
            handler: () => {
                if (this.controller.hand.length < 1) {
                    this.returnToHand(this.controller);
                    return;
                }

                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Discard 1 card at random for ' + this.name + '?',
                        buttons: [
                            { text: 'Yes', method: 'discardCard' },
                            { text: 'No', method: 'returnToHand' }
                        ]
                    },
                    source: this
                });
            }
        });
    }

    discardCard(player) {
        this.game.addMessage('{0} is forced to discard a card to keep {1} in play', player, this);

        player.discardAtRandom(1);

        return true;
    }

    returnToHand(player) {
        this.game.addMessage('{0} is forced to return {1} to their hand', player, this);

        player.returnCardToHand(this);

        return true;
    }
}

TheHound.code = '02009';

export default TheHound;
