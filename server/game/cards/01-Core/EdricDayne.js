import DrawCard from '../../drawcard.js';

class EdricDayne extends DrawCard {
    // Edric Dayne (01106)
    // Stealth.
    // Action: Pay 1 gold to give Edric Dayne a challenge icon of your choice until the end of the
    // phase.
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

export default EdricDayne;
