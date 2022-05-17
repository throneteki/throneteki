const DrawCard = require('../../drawcard.js');

class OlennasCunning extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: event => ['intrigue', 'power'].includes(event.challenge.challengeType) && event.challenge.winner === this.controller
            },
            message: '{player} plays {source} to have the losing opponent name a cardtype and search their deck',
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
        this.game.addMessage('{0} names the {1} cardtype', this.game.currentChallenge.loser, type);
        this.game.promptForDeckSearch(this.controller, {
            activePromptTitle: 'Select a card',
            cardCondition: card => card.getType() !== type,
            onSelect: (player, card, valid) => this.cardSelected(player, card, valid),
            onCancel: player => this.doneSelecting(player),
            source: this
        });

        return true;
    }

    cardSelected(player, card, valid) {
        if(valid) {
            player.moveCard(card, 'hand');
            this.game.addMessage('{0} adds {1} to their hand',
                player, card);
        }
    }

    doneSelecting(player) {
        this.game.addMessage('{0} does not add any card to their hand',
            player);
    }
}

OlennasCunning.code = '01196';

module.exports = OlennasCunning;
