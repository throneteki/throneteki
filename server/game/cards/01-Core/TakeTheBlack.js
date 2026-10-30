import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TakeTheBlack extends DrawCard {
    // Take the Black (01139)
    // Dominance Action: Choose a non-unique character with printed cost 6 or lower. Take control of
    // that character. (Max 1 per round.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Take control of character',
            max: ability.limit.perRound(1),
            phase: 'dominance',
            target: {
                cardCondition: {
                    type: 'character',
                    unique: false,
                    printedCostOrLower: 6,
                    location: 'play area'
                }
            },
            message: '{player} plays {source} to take control of {target}',
            gameAction: GameActions.takeControl((context) => ({
                player: context.player,
                card: context.target
            }))
        });
    }
}

TakeTheBlack.code = '01139';

export default TakeTheBlack;
