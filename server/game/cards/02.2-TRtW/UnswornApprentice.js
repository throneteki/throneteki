import DrawCard from '../../drawcard.js';

class UnswornApprentice extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Gain icon',
            phase: 'challenge',
            limit: ability.limit.perPhase(1),
            handler: () => {
                this.game.promptForIcon(this.controller, this, (icon) => {
                    this.untilEndOfPhase((ability) => ({
                        match: this,
                        effect: ability.effects.addIcon(icon)
                    }));

                    this.game.addMessage(
                        '{0} uses {1} to have {1} gain {2} {3} icon until the end of the phase',
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

UnswornApprentice.code = '02025';

export default UnswornApprentice;
