const DrawCard = require('../../drawcard.js');

class WombOfTheWorld extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Reveal top 5 cards',
            cost: ability.costs.kneelSelf(),
            handler: () => {
                this.revealedCards = this.controller.drawDeck.slice(0, 5);
                this.game.addMessage('{0} kneels {1} to reveal {2} from the top of their deck', this.controller, this, this.revealedCards);

                let characters = this.remainingCards.filter(card => card.getType() === 'character' && card.hasTrait('Dothraki') && this.controller.canPutIntoPlay(card));
                if(characters.length > 0) {
                    this.promptToPutCharacterIntoPlay(characters);
                }
                this.controller.shuffleDrawDeck();
                this.game.addMessage('{0} then shuffles their deck', this.controller);
            }
        });
    }

    promptToPutCharacterIntoPlay(characters) {
        let buttons = characters.map(card => {
            return { method: 'putCharacterIntoPlay', card: card };
        });
        buttons.push({ text: 'Done', method: 'promptToCancel' });
        this.game.promptWithMenu(this.controller, this, {
            activePrompt: {
                menuTitle: 'Put a character into play?',
                buttons: buttons
            },
            source: this
        });
    }

    putCharacterIntoPlay(player, cardId) {
        let card = this.revealedCards.find(card => card.uuid === cardId);
        player.putIntoPlay(card);
        this.game.addMessage('{0} uses {1} to put {2} into play', player, this, card);        
        return true;
    }

    promptToCancel(player) {
        this.game.addMessage('{0} uses {1} but does not put any character into play', player, this);
        return true;
    }
}

WombOfTheWorld.code = '15017';

module.exports = WombOfTheWorld;
