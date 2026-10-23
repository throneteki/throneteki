import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SetDownOurDeeds extends DrawCard {
    // Set Down Our Deeds (20005)
    // Action: Kneel your faction card to discard up to 3 power from a card you own. Draw 2 cards
    // for each power discarded this way.
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard power to draw',
            cost: ability.costs.kneelFactionCard(),
            target: {
                activePromptTitle: 'Select card with power',
                cardCondition: (card, context) =>
                    card.owner === context.player &&
                    ['active plot', 'faction', 'play area'].includes(card.location) &&
                    card.power > 0,
                cardType: ['attachment', 'character', 'faction', 'location', 'plot']
            },
            gameAction: GameActions.choose({
                title: 'Select # of power to discard',
                message: {
                    format: '{player} plays {source} and discards {choice} power from {target} to draw {cards} cards',
                    args: { cards: (context) => Number(context.selectedChoice.text) * 2 }
                },
                choices: (context) =>
                    Object.fromEntries(
                        [1, 2, 3]
                            .filter((amount) => amount <= context.target.power)
                            .map((amount) => [
                                `${amount}`,
                                GameActions.simultaneously([
                                    GameActions.discardPower((context) => ({
                                        card: context.target,
                                        amount
                                    })),
                                    GameActions.drawCards((context) => ({
                                        player: context.player,
                                        amount: amount * 2
                                    }))
                                ])
                            ])
                    )
            })
        });
    }
}

SetDownOurDeeds.code = '20005';

export default SetDownOurDeeds;
