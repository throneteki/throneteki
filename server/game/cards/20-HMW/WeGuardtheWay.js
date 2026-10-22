import DrawCard from '../../drawcard.js';
import TextHelper from '../../TextHelper.js';
import GameActions from '../../GameActions/index.js';

class WeGuardtheWay extends DrawCard {
    // We Guard the Way (20020)
    // Action: Choose X characters with the Guard or House Yronwood trait. Until the end of the
    // phase, each chosen character gains renown and does not kneel when declared as a defender.
    setupCardAbilities(ability) {
        this.xValue({
            min: () => 1,
            max: (context) =>
                context.game.getNumberOfCardsInPlay(
                    (card) => card.getType() === 'character' && isGuard(card)
                )
        });
        this.action({
            message: {
                format: '{player} plays {source} and pays {xValue} gold to have characters gain renown and not kneel when declared as a defender this phase',
                args: { xValue: (context) => context.xValue }
            },
            gameAction: GameActions.chooseCards({
                mode: 'exactly',
                numCards: (context) => context.xValue,
                title: (context) => `Select ${TextHelper.count(context.xValue, 'character')}`,
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    isGuard(card),
                gameAction: (card) =>
                    GameActions.lastingEffect(() => ({
                        duration: 'untilEndOfPhase',
                        match: card,
                        effect: [
                            ability.effects.addKeyword('renown'),
                            ability.effects.doesNotKneelAsDefender()
                        ]
                    }))
            })
        });
    }
}

function isGuard(card) {
    return card.hasTrait('Guard') || card.hasTrait('House Yronwood');
}

WeGuardtheWay.code = '20020';

export default WeGuardtheWay;
