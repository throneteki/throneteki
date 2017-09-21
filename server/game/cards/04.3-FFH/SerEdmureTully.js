const DrawCard = require('../../drawcard.js');

class SerEdmureTully extends DrawCard {

    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPowerChanged: event => {
                    let {card, power} = event;
                    let tullyCharacters = this.game.findAnyCardsInPlay(this.isTullyCharacter);

                    if(card.getType() === 'character'
                       && power > 0
                       && tullyCharacters.length > 0) {
                        this.powerGainingCharacter = card;

                        return true;
                    }
                    return false;
                }
            },
            limit: ability.limit.perRound(1),
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    cardCondition: card => (
                        card.location === 'play area' &&
                        card !== this.powerGainingCharacter &&
                        this.isTullyCharacter(card)
                    ),
                    activePromptTitle: 'Select a character',
                    source: this,
                    onSelect: (player, card) => this.transferPower(card)
                });
            }
        });
    }

    isTullyCharacter(card) {
        return card.getType() === 'character' && card.hasTrait('House Tully');
    }

    transferPower(toCharacter) {
        if(!this.powerGainingCharacter) {
            return false;
        }

        this.game.movePower(this.powerGainingCharacter, toCharacter, 1);

        this.game.addMessage('{0} uses {1} to move 1 power from {2} to {3}',
            this.controller, this, this.powerGainingCharacter, toCharacter);

        this.powerGainingCharacter = undefined;

        return true;
    }

}

SerEdmureTully.code = '04041';

module.exports = SerEdmureTully;
