const DrawCard = require('../../drawcard.js');

class HeCallsItThinking extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            canCancel: true,
            when: {
                onCardAbilityInitiated: (event) =>
                    event.source.controller !== this.controller &&
                    !['agenda', 'plot'].includes(event.source.getType()) &&
                    event.ability.isTriggeredAbility()
            },
            handler: (context) => {
                this.context = context;
                let opponent = context.event.source.controller;

                if (opponent.gold < 1) {
                    this.cancel();
                    return;
                }

                this.game.promptWithMenu(opponent, this, {
                    activePrompt: {
                        menuTitle: 'Pay 1 gold to prevent "He Calls It Thinking"',
                        buttons: [
                            { text: 'Yes', method: 'prevent' },
                            { text: 'No', method: 'cancel' }
                        ]
                    },
                    source: this
                });
            }
        });
    }

    cancel() {
        this.context.event.cancel();
        this.game.addMessage(
            '{0} plays {1} to cancel {2}',
            this.context.player,
            this,
            this.context.event.source
        );
        return true;
    }

    prevent() {
        let opponent = this.context.event.source.controller;
        this.game.spendGold({ player: opponent, amount: 1 });
        this.game.addMessage(
            '{0} plays {1} to try to cancel {2}, but {3} pays 1 gold to prevent the cancel',
            this.context.player,
            this,
            this.context.event.source,
            opponent
        );
        return true;
    }
}

HeCallsItThinking.code = '11096';

module.exports = HeCallsItThinking;
