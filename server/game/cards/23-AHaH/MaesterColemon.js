import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MaesterColemon extends DrawCard {
    // Maester Colemon (23024)
    // Dominance Action: Kneel Maester Colemon to choose a Condition or Item attachment and move it
    // to another eligible character.
    setupCardAbilities(ability) {
        this.action({
            title: 'Move attachment',
            phase: 'dominance',
            cost: ability.costs.kneelSelf(),
            target: {
                activePromptTitle: 'Select an attachment',
                cardCondition: {
                    type: 'attachment',
                    location: 'play area',
                    trait: ['Condition', 'Item']
                }
            },
            message: {
                format: '{player} kneels {costs.kneel} to move {target} from {parent} to another eligible character',
                args: { parent: (context) => context.target.parent }
            },
            gameAction: GameActions.chooseCards({
                title: 'Select a character',
                cardCondition: { location: 'play area', type: 'character' },
                gameAction: (card, context) =>
                    GameActions.attach({
                        player: context.target.controller,
                        attachment: context.target,
                        target: card
                    })
            })
        });
    }
}

MaesterColemon.code = '23024';

export default MaesterColemon;
