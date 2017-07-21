const DrawCard = require('../../../drawcard.js');

class OlennasCunning extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => (
                    ['intrigue', 'power'].includes(challenge.challengeType) &&
                    challenge.winner === this.controller
                )
            },
            handler: () => {
                let buttons = [
                    { text: 'Character', method: 'typeSelected', arg: 'character' },
                    { text: 'Location', method: 'typeSelected', arg: 'location' },
                    { text: 'Attachment', method: 'typeSelected', arg: 'attachment' },
                    { text: 'Event', method: 'typeSelected', arg: 'event' }
                ];

                this.game.promptWithMenu(this.game.currentChallenge.loser, this, {
                    activePrompt: {
                        menuTitle: 'Select a card type',
                        buttons: buttons
                    },
                    source: this
                });
            }
        });
    }

    typeSelected(player, type) {
        this.game.promptForDeckSearch(this.controller, {
            activePromptTitle: 'Select a card add to your hand',
            cardCondition: card => card.getType() !== type,
            onSelect: (player, card) => this.cardSelected(player, card),
            onCancel: player => this.doneSelecting(player),
            source: this
        });

        return true;
    }

    cardSelected(player, card) {
        player.moveCard(card, 'hand');
        this.game.addMessage('{0} uses {1} to search their deck and add {2} to their hand',
            player, this, card);
    }

    doneSelecting(player) {
        this.game.addMessage('{0} uses {1} to search their deck but does not add any card to their hand',
            player, this);
    }
}

OlennasCunning.code = '01196';

module.exports = OlennasCunning;
