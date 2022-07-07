const DrawCard = require('../../drawcard.js');

class SerArysOakheart extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kill to Search your deck',
            condition: context => context.game.getPlayers().every(player => player === context.player || player.getTotalInitiative() > context.player.getTotalInitiative()),
            cost: ability.costs.killSelf(),
            handler: () => {
                this.game.promptForDeckSearch(this.controller, {
                    activePromptTitle: 'Select a character',
                    cardCondition: card => card.getType() === 'character' && card.hasTrait('Lady'),
                    onSelect: (player, card) => this.cardSelected(player, card),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    cardSelected(player, card) {
        this.revealedCard = card;
        if(card.name === 'Arianne Martell') {
            let buttons = [
                { text: 'Add to hand', method: 'addToHand' },
                { text: 'Put into shadows', method: 'putIntoShadows' }
            ];
    
            this.game.promptWithMenu(player, this, {
                activePrompt: {
                    menuTitle: 'Put Arianne Martell into shadows?',
                    buttons: buttons
                },
                source: this
            });
        } else {
            this.addToHand(player);
        }
    }

    addToHand(player) {
        this.game.addMessage('{0} kills {1} to search their deck and add {2} to their hand',
            player, this, this.revealedCard);
        player.moveCard(this.revealedCard, 'hand');
        this.revealedCard = null;
        return true;
    }

    putIntoShadows(player) {
        this.game.addMessage('{0} kills {1} to search their deck and put {2} into shadows',
            player, this, this.revealedCard);
        player.putIntoShadows(this.revealedCard, false);
        this.revealedCard = null;
        return true;
    }

    doneSelecting(player) {
        this.game.addMessage('{0} uses {1} to search their deck, but does not add any card to their hand',
            player, this);
    }
}

SerArysOakheart.code = '23007';

module.exports = SerArysOakheart;
