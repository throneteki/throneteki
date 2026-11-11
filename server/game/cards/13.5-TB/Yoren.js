import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class Yoren extends DrawCard {
    // Yoren (13085)
    // Reaction: After Yoren enters play, choose a character with printed cost 5 or lower. Take
    // control of that character until Yoren leaves play.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) => event.card === context.source
            },
            target: {
                cardCondition: (card) =>
                    card.getType() === 'character' &&
                    card.getPrintedCost() <= 5 &&
                    card.location === 'play area'
            },
            message: '{player} uses {source} to take control of {target}',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'custom',
                until: {
                    onCardLeftPlay: (event) =>
                        event.card === context.source || event.card === context.target
                },
                match: context.target,
                effect: ability.effects.takeControl(context.player)
            }))
        });
    }
}

Yoren.code = '13085';

export default Yoren;
