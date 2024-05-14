const DrawCard = require('../../drawcard.js');
const TextHelper = require('../../TextHelper');

class WordsAreWind extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            canCancel: true,
            when: {
                onCardAbilityInitiated: (event) =>
                    event.source.getType() === 'event' && event.player !== this.controller
            },
            handler: (context) => {
                this.context = context;

                this.game.addMessage(
                    '{0} plays {1} to have {2} choose whether to cancel {3} or have {0} draw 2 cards',
                    context.player,
                    this,
                    context.event.player,
                    context.event.source
                );

                this.game.promptWithMenu(context.event.player, this, {
                    activePrompt: {
                        menuTitle: `Cancel ${context.event.source.name} or ${context.player.name} draws 2 cards?`,
                        buttons: [
                            { text: `Cancel ${context.event.source.name}`, method: 'cancel' },
                            { text: `${context.player.name} draws 2 cards`, method: 'draw' }
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
            '{0} chooses to have {1} cancelled for {2}',
            this.context.event.player,
            this.context.event.source,
            this
        );
        return true;
    }

    draw() {
        let cards = this.context.player.drawCardsToHand(2).length;
        this.game.addMessage(
            '{0} chooses to have {1} draw {2} for {3}',
            this.context.event.player,
            this.context.player,
            TextHelper.count(cards, 'card'),
            this
        );
        return true;
    }
}

WordsAreWind.code = '09044';

module.exports = WordsAreWind;
