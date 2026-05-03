import PlotCard from '../../plotcard.js';

class FeastOrFamine extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: (context) => {
                this.game.promptWithMenu(context.player, this, {
                    activePrompt: {
                        menuTitle: `Increase gold value or claim value on ${this.name}?`,
                        buttons: [
                            { text: 'Gold +5', method: 'chooseGold' },
                            { text: 'Claim +2', method: 'chooseClaim' }
                        ]
                    },
                    source: this
                });
            }
        });
    }

    chooseGold(player) {
        this.untilEndOfRound((ability) => ({
            match: this,
            effect: ability.effects.modifyGold(5)
        }));

        this.game.addMessage('{0} increases the gold value by 5 on {1}', player, this);

        return true;
    }

    chooseClaim(player) {
        this.untilEndOfRound((ability) => ({
            match: this,
            effect: ability.effects.modifyClaim(2)
        }));

        this.game.addMessage('{0} increases the claim value by 2 on {1}', player, this);

        return true;
    }
}

FeastOrFamine.code = '00372';

export default FeastOrFamine;
