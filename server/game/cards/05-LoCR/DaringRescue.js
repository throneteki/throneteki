import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class DaringRescue extends DrawCard {
    // Daring Rescue (05024)
    // Play only if you control a Knight character.
    // Challenges Action: Return a character you control to its owner's hand. Then, have a Knight
    // character you control gain 1 power.
    setupCardAbilities() {
        this.action({
            title: 'Return character then have knight gain power',
            condition: (context) =>
                context.player.anyCardsInPlay(
                    (card) => card.hasTrait('Knight') && card.getType() === 'character'
                ),
            phase: 'challenge',
            target: {
                activePromptTitle: 'Select a character to return to hand',
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.player &&
                    card.getType() === 'character'
            },
            message: "{player} plays {source} to return {target} to its owner's hand",
            gameAction: GameActions.returnCardToHand((context) => ({ card: context.target })).then({
                target: {
                    activePromptTitle: 'Select a character to gain power',
                    cardCondition: (card, context) =>
                        card.location === 'play area' &&
                        card.hasTrait('Knight') &&
                        card.getType() === 'character' &&
                        card.controller === context.player,
                    gameAction: 'gainPower'
                },
                message: 'Then {player} uses {source} to have {target} gain 1 power',
                gameAction: GameActions.gainPower((context) => ({
                    card: context.target,
                    amount: 1
                }))
            })
        });
    }
}

DaringRescue.code = '05024';

export default DaringRescue;
