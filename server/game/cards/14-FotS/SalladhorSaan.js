import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SalladhorSaan extends DrawCard {
    // Salladhor Saan (14005)
    // Reaction: After you marshal a Smuggler character, choose and kneel a location. Then, gain
    // gold equal to that location's printed cost. (Limit once per round.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.playingType === 'marshal' &&
                    event.card.controller === context.player &&
                    event.card.hasTrait('Smuggler')
            },
            target: {
                activePromptTitle: 'Select a location',
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'location'
            },
            message: '{player} uses {source} to kneel {target}',
            gameAction: GameActions.kneelCard((context) => ({ card: context.target })).then({
                message: {
                    format: 'Then {player} gains {gold} gold',
                    args: { gold: (context) => context.parentContext.target.getPrintedCost() }
                },
                gameAction: GameActions.gainGold((context) => ({
                    player: context.player,
                    amount: context.parentContext.target.getPrintedCost()
                }))
            }),
            limit: ability.limit.perRound(1)
        });
    }
}

SalladhorSaan.code = '14005';

export default SalladhorSaan;
