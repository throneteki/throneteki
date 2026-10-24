import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheRatCook extends DrawCard {
    // "The Rat Cook" (08007)
    // Marshaling Action: Choose a character with printed cost X or lower. X is the number of
    // Steward characters you control. Until the end of the round, take control of that character,
    // and treat its printed text box as if it were blank (except for Traits).
    setupCardAbilities(ability) {
        this.action({
            title: 'Blank and take control of character',
            phase: 'marshal',
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.getPrintedCost() <= context.source.getNumberOfStewards()
            },
            message:
                '{player} plays {source} to blank and take control of {target} until the end of the round',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfRound',
                match: context.target,
                effect: [
                    ability.effects.takeControl(context.player),
                    ability.effects.blankExcludingTraits
                ]
            }))
        });
    }

    getNumberOfStewards() {
        return this.controller.getNumberOfCardsInPlay(
            (card) => card.getType() === 'character' && card.hasTrait('Steward')
        );
    }
}

TheRatCook.code = '08007';

export default TheRatCook;
