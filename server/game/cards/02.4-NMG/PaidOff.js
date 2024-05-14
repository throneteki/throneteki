import DrawCard from '../../drawcard.js';

class PaidOff extends DrawCard {
    setupCardAbilities() {
        this.attachmentRestriction({ controller: 'opponent' });
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.challengeType === 'intrigue' &&
                    !this.parent.kneeled &&
                    event.challenge.winner === this.controller
            },
            handler: () => {
                this.parent.controller.kneelCard(this.parent);
                this.game.addMessage(
                    '{0} uses {1} to kneel {2}',
                    this.controller,
                    this,
                    this.parent
                );

                let player = this.parent.controller;
                if (player.getSpendableGold({ activePlayer: player }) < 1) {
                    this.cancel(player);
                    return false;
                }

                this.game.promptWithMenu(player, this, {
                    activePrompt: {
                        menuTitle: 'Pay 1 gold to stand ' + this.parent.name,
                        buttons: [
                            { text: 'Yes', method: 'stand' },
                            { text: 'No', method: 'cancel' }
                        ]
                    },
                    source: this
                });
            }
        });
    }

    stand(player) {
        if (player.getSpendableGold({ activePlayer: player }) < 1) {
            return false;
        }

        this.game.transferGold({ from: player, to: this.controller, amount: 1 });
        player.standCard(this.parent);

        this.game.addMessage('{0} pays 1 gold for {1} to stand {2}', player, this, this.parent);

        return true;
    }

    cancel(player) {
        this.game.addMessage(
            '{0} does not pay 1 gold for {1} so {2} remains kneeled',
            player,
            this,
            this.parent
        );

        return true;
    }
}

PaidOff.code = '02071';

export default PaidOff;
