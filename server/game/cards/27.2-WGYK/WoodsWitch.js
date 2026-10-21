import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class WoodsWitch extends DrawCard {
    // Woods Witch (27031)
    // Reaction: After a character is discarded from an opponent's hand, sacrifice Woods Witch to
    // name a cardtype. That player must sacrifice a card with that cardtype and the same printed
    // cost as the discarded card.
    setupCardAbilities(ability) {
        const discardingPlayer = (context) => context.event.cardStateWhenDiscarded.controller;

        this.reaction({
            when: {
                onCardDiscarded: (event, context) =>
                    event.cardStateWhenDiscarded.location === 'hand' &&
                    event.card.getType() === 'character' &&
                    event.cardStateWhenDiscarded.controller !== context.player
            },
            cost: ability.costs.sacrificeSelf(),
            gameAction: GameActions.choose({
                title: 'Name a card type',
                message: {
                    format: '{player} sacrifices {source} to name {choice} and force {targetPlayer} to sacrifice a card of that type with printed cost {cost}',
                    args: {
                        targetPlayer: discardingPlayer,
                        cost: (context) => context.event.card.getPrintedCost()
                    }
                },
                choices: {
                    Character: this.sacrificeOfType('character', discardingPlayer),
                    Location: this.sacrificeOfType('location', discardingPlayer),
                    Attachment: this.sacrificeOfType('attachment', discardingPlayer)
                }
            })
        });
    }

    sacrificeOfType(type, discardingPlayer) {
        return GameActions.chooseCards({
            player: discardingPlayer,
            title: (context) =>
                `Select a ${type} with printed cost ${context.event.card.getPrintedCost()} to sacrifice`,
            cardCondition: (card, context) =>
                card.location === 'play area' &&
                card.controller === context.choosingPlayer &&
                card.getType() === type &&
                card.getPrintedCost() === context.event.card.getPrintedCost(),
            gameAction: (card, context) =>
                GameActions.sacrificeCard({ card, player: context.choosingPlayer })
        });
    }
}

WoodsWitch.code = '27031';

export default WoodsWitch;
