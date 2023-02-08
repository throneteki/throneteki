const DrawCard = require('../../drawcard.js');

class SerAndreyDalt extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.allCards.filter(card => card.location === 'shadows').length <= 3,
            match: this,
            effect: ability.effects.addKeyword('Renown')
        });
        this.interrupt({
            when: {
                onDominanceDetermined: event => this.controller === event.winner
            },
            choosePlayer: () => true,
            cost: ability.costs.discardFromShadows(),
            message: '{player} uses {source} and discards {costs.discardFromShadows} from shadows to have {chosenPlayer} win dominance instead',
            handler: context => {
                context.event.winner = context.chosenPlayer;
            }
        });
    }
}

SerAndreyDalt.code = '24010';

module.exports = SerAndreyDalt;
