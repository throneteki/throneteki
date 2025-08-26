import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TakingTheShieldIslands extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.isMatch({
                        winner: this.controller,
                        attackingPlayer: this.controller
                    }) && event.challenge.getWinnerCards().some((card) => card.hasTrait('Raider'))
            },
            message: {
                format: "{player} plays {source} to look {loser}'s hand and place {amount} card(s) on top of their deck",
                args: {
                    loser: (context) => context.event.challenge.loser,
                    amount: (context) => this.getAmount(context)
                }
            },
            handler: (context) => {
                const numCards = this.getAmount(context);
                this.game.promptForSelect(context.player, {
                    activePromptTitle:
                        numCards === 1 ? 'Select a card' : 'Select up to 2 cards (bottom first)',
                    source: this,
                    numCards,
                    revealTargets: true,
                    cardCondition: (card) =>
                        card.location === 'hand' &&
                        card.controller === context.event.challenge.loser,
                    onSelect: (player, cards) => this.onCardsSelected(player, cards, context)
                });
            }
        });
    }

    onCardsSelected(player, cards, context) {
        const placeAction = (card) =>
            GameActions.placeCard({
                card,
                player,
                location: 'draw deck'
            });
        if (Array.isArray(cards)) {
            this.game.resolveGameAction(GameActions.simultaneously(cards.map(placeAction)));
        } else {
            placeAction(cards);
        }
        this.game.addMessage(
            "{0} then uses {1} to place {2} card(s) on top of {3}'s deck",
            player,
            this,
            this.getAmount(context),
            context.event.challenge.loser
        );

        return true;
    }

    getAmount(context) {
        return context.cardStateWhenInitiated.location === 'shadows' ? 2 : 1;
    }
}

TakingTheShieldIslands.code = '26044';

export default TakingTheShieldIslands;
