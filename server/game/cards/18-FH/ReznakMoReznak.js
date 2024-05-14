const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class ReznakMoReznak extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            limit: ability.limit.perRound(2),
            when: {
                onCardDiscarded: (event) =>
                    event.card.controller === this.controller &&
                    event.originalLocation === 'hand' &&
                    event.card.getType() === 'character'
            },
            handler: (context) => {
                this.context = context;
                this.discarded = context.event.card;
                this.game.addMessage('{0} uses {1} to have {1} gain 1 gold', context.player, this);
                this.modifyGold(1);

                if (
                    this.gold >= this.discarded.getPrintedCost() &&
                    context.player.canPutIntoPlay(this.discarded) &&
                    this.discarded.location === 'discard pile'
                ) {
                    this.game.promptWithMenu(context.player, this, {
                        activePrompt: {
                            menuTitle: `Put ${this.discarded.name} into play?`,
                            buttons: [
                                { text: 'Yes', method: 'accept' },
                                { text: 'No', method: 'decline' }
                            ]
                        },
                        source: this
                    });
                }
            }
        });
    }

    accept(player) {
        this.game.addMessage(
            'Then {0} uses {1} to put {2} into play and discards {3} gold from {1}.',
            player,
            this,
            this.discarded,
            this.discarded.getPrintedCost()
        );
        this.modifyGold(-this.discarded.getPrintedCost());
        this.game.resolveGameAction(
            GameActions.putIntoPlay(() => ({
                card: this.discarded
            })),
            this.context
        );
        return true;
    }

    decline() {
        return true;
    }
}

ReznakMoReznak.code = '18013';

module.exports = ReznakMoReznak;
