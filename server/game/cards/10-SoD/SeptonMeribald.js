import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SeptonMeribald extends DrawCard {
    // Septon Meribald (10040)
    // Action: Kneel Septon Meribald to choose and stand up to 3 characters with printed STR 1 or
    // lower. (Limit once per round.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand up to 3 characters',
            cost: ability.costs.kneelSelf(),
            target: {
                mode: 'upTo',
                numCards: 3,
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.getPrintedStrength() <= 1 &&
                    card.kneeled,
                gameAction: 'stand'
            },
            message: '{player} kneels {source} to stand {target}',
            gameAction: GameActions.simultaneously((context) =>
                context.target.map((card) => GameActions.standCard({ card }))
            ),
            limit: ability.limit.perRound(1)
        });
    }
}

SeptonMeribald.code = '10040';

export default SeptonMeribald;
