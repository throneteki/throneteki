const DrawCard = require('../../drawcard.js');

class SerIlynPayne extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kill a character',
            phase: 'marshal',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: card => card.location === 'play area' && card.getType() === 'character' && card.getCost() <= 3,
                gameAction: 'kill'
            },
            handler: context => {
                let player = context.player;
                let card = context.target;

                this.game.addMessage('{0} kneels {1} to kill {2}', player, this, card);

                card.controller.killCharacter(card);
            }
        });
    }
}

SerIlynPayne.code = '02109';

module.exports = SerIlynPayne;
