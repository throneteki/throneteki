const DrawCard = require('../../drawcard.js');

class SerAndreyDalt extends DrawCard {
    setupCardAbilities(ability) {
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
