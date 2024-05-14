const DrawCard = require('../../drawcard.js');

class VanguardLancer extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this
            },
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card) => card.controller !== this.controller && card.getPower() > 0,
                cardType: ['character', 'faction']
            },
            handler: (context) => {
                if (context.target.getType() === 'faction') {
                    this.game.addMessage(
                        "{0} uses {1} to remove 1 power from {2}'s faction card",
                        this.controller,
                        this,
                        context.target.owner
                    );
                } else {
                    this.game.addMessage(
                        '{0} uses {1} to remove 1 power from {2}',
                        this.controller,
                        this,
                        context.target
                    );
                }

                context.target.modifyPower(-1);
            }
        });
    }
}

VanguardLancer.code = '01057';

module.exports = VanguardLancer;
