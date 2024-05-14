const DrawCard = require('../../drawcard.js');

class VaramyrSixskins extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onPhaseStarted: (event) => event.phase === 'challenge'
            },
            handler: () => {
                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Choose one',
                        buttons: [
                            { text: 'Bear', method: 'bearSelected' },
                            { text: 'Eagle', method: 'eagleSelected' },
                            { text: 'Cat', method: 'catSelected' },
                            { text: 'Wolf', method: 'wolfSelected' }
                        ]
                    },
                    source: this
                });
            }
        });
    }

    bearSelected() {
        this.untilEndOfPhase((ability) => ({
            match: this,
            effect: [ability.effects.addTrait('Bear'), ability.effects.modifyStrength(5)]
        }));

        this.game.addMessage(
            '{0} uses {1} and has it gain the Bear trait and 5 STR until the end of the phase',
            this.controller,
            this
        );

        return true;
    }

    eagleSelected() {
        this.untilEndOfPhase((ability) => ({
            match: this,
            effect: [
                ability.effects.addTrait('Eagle'),
                ability.effects.addIcon('intrigue'),
                ability.effects.addKeyword('insight')
            ]
        }));

        this.game.addMessage(
            '{0} uses {1} and has it gain the Eagle trait, an {2} icon and insight until the end of the phase',
            this.controller,
            this,
            'intrigue'
        );

        return true;
    }

    catSelected() {
        this.untilEndOfPhase((ability) => ({
            match: this,
            effect: [
                ability.effects.addTrait('Cat'),
                ability.effects.addIcon('power'),
                ability.effects.addKeyword('stealth')
            ]
        }));

        this.game.addMessage(
            '{0} uses {1} and has it gain the Cat trait, an {2} icon and stealth until the end of the phase',
            this.controller,
            this,
            'power'
        );

        return true;
    }

    wolfSelected() {
        this.untilEndOfPhase((ability) => ({
            match: this,
            effect: [
                ability.effects.addTrait('Wolf'),
                ability.effects.modifyStrength(2),
                ability.effects.addKeyword('intimidate')
            ]
        }));

        this.game.addMessage(
            '{0} uses {1} and has it gain the Wolf trait, intimidate and 2 STR until the end of the phase',
            this.controller,
            this
        );

        return true;
    }
}

VaramyrSixskins.code = '11001';

module.exports = VaramyrSixskins;
