const DrawCard = require('../../../drawcard.js');

class SerGregorClegane extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardDiscarded: (event, challenge, card) => challenge.winner === this.controller && card === this && this.game.addMessage('test1')
            },
            handler: context => {
                var discardedCard = context.event.params[2];
                this.game.addMessage(discardedCard.name);
                if(discardedCard.getType !== 'character')
                {
                    return;
                }

                var otherPlayer = this.game.getOtherPlayer(this.controller);
                if(!otherPlayer){
                    return;
                }

                otherPlayer.moveCard(discardedCard, 'dead pile');

                this.game.addMessage('{0} uses {1} to move {2} to {3} dead pile', this.controller, this, discardedCard, otherPlayer);

                var price = discardedCard.getCost();
                this.game.promptForSelect(this.controller, {
                    activePromptTitle: 'Select and kill an enemy character with cost ' + price,
                    waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
                    cardCondition: card =>
                        card.location === 'play area'
                        && card.getType() === 'character'
                        && card.getCost() === price,
                    onSelect: (player, selectedCard) =>
                        this.onCardSelected(player, selectedCard, otherPlaeyr)

                });
            }

        });       
    }

    onCardSelected(palyer, selectedCard, otherPlayer) {
        this.game.addMessage('{0} uses {1} to kill {2}', player, this, selectedCard);
        otherPlayer.killCharacter(selectedCard);
    }
}

SerGregorClegane.code = '02049';

module.exports = SerGregorClegane;

