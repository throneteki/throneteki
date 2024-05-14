const DrawCard = require('../../drawcard.js');

class RiverrunMinstrel extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.hasTrait('House Tully') &&
                    card.getType() === 'character',
                gameAction: 'gainPower'
            },
            handler: (context) => {
                context.target.modifyPower(1);
                this.game.addMessage(
                    '{0} uses {1} to have {2} gain a power',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

RiverrunMinstrel.code = '03009';

module.exports = RiverrunMinstrel;
