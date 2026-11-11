import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class AryaStark extends DrawCard {
    // Arya Stark (03007)
    // Reaction: After a [stark] character you control is killed, sacrifice Arya Stark to choose and
    // kill a character with STR 3 or lower.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCharacterKilled: (event, context) =>
                    event.cardStateWhenKilled.controller === context.source.controller &&
                    event.cardStateWhenKilled.isFaction('stark')
            },
            cost: ability.costs.sacrificeSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.getStrength() <= 3,
                gameAction: 'kill'
            },
            message: '{player} sacrifices {source} to kill {target}',
            gameAction: GameActions.kill((context) => ({ card: context.target }))
        });
    }
}

AryaStark.code = '03007';

export default AryaStark;
