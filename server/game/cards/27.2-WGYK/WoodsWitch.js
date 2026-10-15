import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class WoodsWitch extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDiscarded: (event) =>
                    event.cardStateWhenDiscarded.location === 'hand' &&
                    event.card.getType() === 'character' &&
                    event.cardStateWhenDiscarded.controller !== this.controller
            },
            cost: ability.costs.sacrificeSelf(),
            handler: (context) => {
                const discardedCard = context.event.card;
                const opponent = context.event.cardStateWhenDiscarded.controller;
                const cost = discardedCard.getPrintedCost();

                this.game.resolveGameAction(
                    GameActions.choose({
                        title: 'Name a card type',
                        message: {
                            format: '{player} sacrifices {source} to name {choice} and force {targetPlayer} to sacrifice a card of that type with printed cost {cost}',
                            args: {
                                targetPlayer: () => opponent,
                                cost: () => cost
                            }
                        },
                        choices: {
                            Character: GameActions.genericHandler(() =>
                                this.promptForType(opponent, cost, 'character')
                            ),
                            Location: GameActions.genericHandler(() =>
                                this.promptForType(opponent, cost, 'location')
                            ),
                            Attachment: GameActions.genericHandler(() =>
                                this.promptForType(opponent, cost, 'attachment')
                            )
                        }
                    }),
                    context
                );
            }
        });
    }

    promptForType(opponent, cost, type) {
        this.game.promptForSelect(opponent, {
            activePromptTitle: `Select a ${type} with printed cost ${cost} to sacrifice`,
            cardCondition: (card) =>
                card.location === 'play area' &&
                card.controller === opponent &&
                card.getType() === type &&
                card.getPrintedCost() === cost &&
                GameActions.sacrificeCard({ card, player: opponent }).allow(),
            onSelect: (player, card) => this.onSacrificeSelected(player, card),
            source: this
        });
        return true;
    }

    onSacrificeSelected(player, card) {
        this.game.addMessage('{0} sacrifices {1}', player, card);
        this.game.resolveGameAction(GameActions.sacrificeCard({ card, player }));
        return true;
    }
}

WoodsWitch.code = '27031';

export default WoodsWitch;
