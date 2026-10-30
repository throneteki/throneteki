import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class GreyWind extends DrawCard {
    // Grey Wind (01145)
    // Intimidate. No attachments.
    // Challenges Action: Kneel Grey Wind to choose and kill a character with STR 1 or lower. (STR 2
    // or lower instead if you control Robb Stark).
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel Grey Wind to kill a character',
            cost: ability.costs.kneelSelf(),
            phase: 'challenge',
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.getStrength() <= maxStrength(context.player)
            },
            message: '{player} kneels {source} to kill {target}',
            gameAction: GameActions.kill((context) => ({ card: context.target }))
        });
    }
}

function maxStrength(player) {
    return player.anyCardsInPlay((card) => card.name === 'Robb Stark') ? 2 : 1;
}

GreyWind.code = '01145';

export default GreyWind;
