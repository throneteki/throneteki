import DrawCard from '../../drawcard.js';

class TywinLannister extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCardDiscarded: {
                    aggregateBy: (event) => ({
                        controller: event.card.controller,
                        location: event.originalLocation
                    }),
                    condition: (aggregate, events) =>
                        events.length === 1 && aggregate.location === 'draw deck'
                }
            },
            message: {
                format: "{player} uses {source} to look at the top 2 cards of {discardingPlayer}'s deck and discard 1",
                args: { discardingPlayer: (context) => context.aggregate.controller }
            },
            handler: (context) => {
                this.eventObj = context.events[0];
                let top2Cards = context.aggregate.controller.drawDeck.slice(0, 2);
                let buttons = top2Cards.map((card) => {
                    return { method: 'cardSelected', card: card, mapCard: true };
                });

                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Select which card to discard',
                        buttons: buttons
                    },
                    source: this
                });
            }
        });
    }

    cardSelected(player, card) {
        this.eventObj.card = card;
        this.game.addMessage('{0} chooses to discard {1}', this.controller, card);

        return true;
    }
}

TywinLannister.code = '05006';

export default TywinLannister;
