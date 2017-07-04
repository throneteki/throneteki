const DrawCard = require('../../../drawcard.js');

class MountainsOfTheMoon extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: event => event.card.hasTrait('Clansman') && event.card.getType() === 'character'
            },
            handler: context => {
                this.game.promptForIcon(this.controller, context);

                this.game.queueSimpleStep(() => {
                    this.untilEndOfPhase(ability => ({
                        match: context.event.card,
                        effect: ability.effects.addIcon(context.icon)
                    }));

                    this.game.addMessage('{0} uses {1} to have {2} gain {3} {4} icon until the end of the phase',
                                this.controller, this, context.event.card, context.icon === 'intrigue' ? 'an' : 'a', context.icon);
                });              
            }
        });
    }
}

MountainsOfTheMoon.code = '05018';

module.exports = MountainsOfTheMoon;
