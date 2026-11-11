import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Yoren extends DrawCard {
    // Yoren (17116)
    // Reaction: After Yoren enters play, choose an opponent. That player must choose a standing
    // character they control with printed cost 5 or lower. Take control of that character until
    // Yoren leaves play.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) => event.card === context.source
            },
            chooseOpponent: true,
            message:
                '{player} uses {source} to have {opponent} choose a standing character with printed cost 5 or lower to take control of',
            gameAction: GameActions.chooseCards({
                player: (context) => context.opponent,
                title: 'Select a character',
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller === context.choosingPlayer &&
                    card.getPrintedCost() <= 5 &&
                    !card.kneeled &&
                    context.player.canControl(card),
                gameAction: (card) =>
                    GameActions.lastingEffect((context) => ({
                        duration: 'custom',
                        until: {
                            onCardLeftPlay: (event) =>
                                event.card === context.source || event.card === card
                        },
                        match: card,
                        effect: ability.effects.takeControl(context.player)
                    }))
            })
        });
    }
}

Yoren.code = '17116';

export default Yoren;
