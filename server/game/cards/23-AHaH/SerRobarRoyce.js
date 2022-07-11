const DrawCard = require('../../drawcard.js');

class SerRobarRoyce extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onCharacterKilled: event => event.card.hasTrait('Lady') && event.card.canBeSaved() && event.allowSave
            },
            cost: ability.costs.revealHand(),
            message: {
                format: '{player} uses {source} and reveals their hand to save {character} and have {source} gain 1 power.',
                args: { character: context => context.event.card }
            },
            handler: context => {
                context.event.saveCard();
                this.modifyPower(1);
                if(context.game.filterCardsInPlay(card => card.name === 'The Knight of Flowers').length > 0) {
                    this.game.addMessage('Then, due to The Knight of Flowers being in play, {0} is forced to kill {1}', context.player, this);
                    this.game.killCharacter(this);
                }
            } 
        });
    }
}

SerRobarRoyce.code = '23015';

module.exports = SerRobarRoyce;
