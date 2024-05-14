const DrawCard = require('../../drawcard.js');

class EdricDayne extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give icon',
            cost: ability.costs.payGold(1),
            handler: () => {
                this.game.promptForIcon(this.controller, this, (icon) => {
                    this.untilEndOfPhase((ability) => ({
                        match: this,
                        effect: ability.effects.addIcon(icon)
                    }));
                    this.game.addMessage(
                        '{0} pays 1 gold to give {1} {2} {3} icon until the end of the phase',
                        this.controller,
                        this,
                        icon === 'intrigue' ? 'an' : 'a',
                        icon
                    );
                });
            }
        });
    }
}

EdricDayne.code = '01106';

module.exports = EdricDayne;
