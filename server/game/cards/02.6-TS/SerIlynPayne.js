import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SerIlynPayne extends DrawCard {
    // Ser Ilyn Payne (02109)
    // Marshaling Action: Kneel Ser Ilyn Payne to choose and kill a character with printed cost 3 or
    // lower.
    setupCardAbilities(ability) {
        this.action({
            title: 'Kill a character',
            phase: 'marshal',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.getPrintedCost() <= 3,
                gameAction: 'kill'
            },
            message: '{player} kneels {source} to kill {target}',
            gameAction: GameActions.kill((context) => ({ card: context.target }))
        });
    }
}

SerIlynPayne.code = '02109';

export default SerIlynPayne;
