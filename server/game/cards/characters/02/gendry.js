const DrawCard = require('../../../drawcard.js');

class Gendry extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onDominanceDetermined: (event, winner) => this.controller === winner
            },
            handler: () => {
                this.modifyPower(1),
                this.game.addMessage('{0} uses {1} gain a power on {2}', this.controller, this, this);
            }
        });

        this.forcedReaction({
            when: {
                onDominanceDetermined: (event, winner) => this.game.getOtherPlayer(this.controller) === winner
            },
            handler: () => {
                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Discard 1 power from ' + this.name + ' or sacrifice a bastard?',
                        buttons: [
                            { text: 'Discard power', method: 'discardPower' },
                            { text: 'Sacrifice bastard', method: 'sacrificeBastard' }
                        ]
                    },
                    waitingPromptTitle: 'Waiting for opponent to use ' + this.name
                });
            }
        });
    }

    discardPower(player) {
        this.modifyPower(-1);
        this.game.addMessage('{0} is forced to discard a power from {1}', player, this);

        return true;
    }

    sacrificeBastard(player) {
        this.game.promptForSelect(player, {
            cardCondition: card => card.location === 'play area' && card.hasTrait('Bastard') && card.getType() === 'character' && card.controller === this.controller,
            activePromptTitle: 'Select a bastard to sacrifice',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            onSelect: (player, card) => {
                card.controller.sacrificeCard(card);
                this.game.addMessage('{0} is forced by {1} to sacrifice {2}', player, this, card);
            }
        });

        return true;
    }
}

Gendry.code = '02068';

module.exports = Gendry;
