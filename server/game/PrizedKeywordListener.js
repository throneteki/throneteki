import GameActions from './GameActions/index.js';

class PrizedKeywordListener {
    constructor(game) {
        this.game = game;

        this.registerEvents();
    }

    registerEvents() {
        this.game.on('onCardLeftPlay', (event) =>
            this.handlePrizedKeyword({
                controller: event.cardStateWhenLeftPlay.controller,
                prizedValue: event.cardStateWhenLeftPlay.getPrizedValue(),
                card: event.card
            })
        );
        this.game.on('onCardPlayed', (event) =>
            this.handlePrizedKeyword({
                controller: event.player,
                prizedValue: event.card.getPrizedValue(),
                card: event.card
            })
        );
    }

    handlePrizedKeyword({ controller, prizedValue, card }) {
        if (prizedValue === 0) {
            return;
        }

        this.game.resolveGameAction(this.createGameAction({ controller, prizedValue, card }));
    }

    createGameAction({ controller, prizedValue, card }) {
        const opponents = this.game.getOpponents(controller);

        return GameActions.simultaneously(
            opponents.map((opponent) =>
                GameActions.gainPower({
                    card: opponent.faction,
                    amount: prizedValue
                }).thenExecute(() => {
                    this.game.addMessage(
                        '{opponent} gains {prizedValue} power for Prized on {card}',
                        {
                            opponent,
                            prizedValue,
                            card
                        }
                    );
                })
            )
        );
    }
}

export default PrizedKeywordListener;
