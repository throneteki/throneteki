const PlotCard = require('../../plotcard.js');

class FeastOrFamine extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: () => {
                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Increase gold value on ' + this.name + ' by 5?',
                        buttons: [
                            { text: 'Yes', method: 'accept' },
                            { text: 'No', method: 'decline' }
                        ]
                    },
                    source: this
                });
            }
        });
    }

    accept() {
        this.untilEndOfRound(ability => ({
            match: this,
            effect: [
                ability.effects.modifyGold(5),
                ability.effects.modifyClaim(-2)
            ]
        }));

        this.game.addMessage('{0} increases the gold value by 5 and reduces the claim value by 2 on {1}',
            this.controller, this);

        return true;
    }

    decline() {
        this.game.addMessage('{0} does not increase the gold value on {1}', this.controller, this);

        return true;
    }
}

FeastOrFamine.code = '00006';

module.exports = FeastOrFamine;
