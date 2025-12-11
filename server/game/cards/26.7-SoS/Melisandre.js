import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Melisandre extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) =>
                card.getType() === 'character' && card.isParticipating() && !card.isShadow(),
            targetController: 'any',
            effect: ability.effects.modifyStrength(-1)
        });

        this.reaction({
            when: {
                onCardStrengthChanged: (event) =>
                    event.amount < 0 && event.card.getStrength() === 0 && event.applying
            },
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {costs.kneel} to kill {character}',
                args: { character: (context) => context.event.card }
            },
            limit: ability.limit.perRound(2),
            gameAction: GameActions.putIntoShadows((context) => ({ card: context.event.card }))
        });
    }
}

Melisandre.code = '26501';
Melisandre.version = '1.3.1';

export default Melisandre;
