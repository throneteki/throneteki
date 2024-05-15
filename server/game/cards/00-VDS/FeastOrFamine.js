import PlotCard from '../../plotcard.js';

class FeastOrFamine extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: (context) => {
                this.game.promptWithMenu(context.player, this, {
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

    accept(player) {
        this.untilEndOfRound((ability) => ({
            match: this,
            effect: [ability.effects.modifyGold(5), ability.effects.modifyClaim(-2)]
        }));

        this.game.addMessage(
            '{0} increases the gold value by 5 and reduces the claim value by 2 on {1}',
            player,
            this
        );

        return true;
    }

    decline(player) {
        this.game.addMessage('{0} does not increase the gold value on {1}', player, this);

        return true;
    }
}

FeastOrFamine.code = '00006';

export default FeastOrFamine;
