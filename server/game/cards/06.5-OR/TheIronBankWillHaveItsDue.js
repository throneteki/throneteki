import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheIronBankWillHaveItsDue extends DrawCard {
    // The Iron Bank Will Have Its Due (06099)
    // Action: If it is not the taxation phase, kneel your faction card and return a character to
    // your hand to gain gold equal to that character's printed cost. Until the end of the round,
    // you cannot marshal or put into play any card with the same title as that character.
    setupCardAbilities(ability) {
        this.action({
            title: 'Return character to gain gold',
            condition: (context) => context.game.currentPhase !== 'taxation',
            cost: [
                ability.costs.kneelFactionCard(),
                ability.costs.returnToHand((card) => card.getType() === 'character')
            ],
            message: {
                format: '{player} plays {source}, kneels their faction card and returns {costs.returnToHand} to their hand to gain {gold} gold, and cannot marshal or put into play any card titled {title} until the end of the round',
                args: {
                    gold: (context) => context.costs.returnToHand.getPrintedCost(),
                    title: (context) => context.costs.returnToHand.name
                }
            },
            gameAction: GameActions.simultaneously([
                GameActions.gainGold((context) => ({
                    player: context.player,
                    amount: context.costs.returnToHand.getPrintedCost()
                })),
                GameActions.lastingEffect((context) => ({
                    duration: 'untilEndOfRound',
                    effect: ability.effects.cannotMarshalOrPutIntoPlayByTitle(
                        context.costs.returnToHand.name
                    )
                }))
            ])
        });
    }
}

TheIronBankWillHaveItsDue.code = '06099';

export default TheIronBankWillHaveItsDue;
