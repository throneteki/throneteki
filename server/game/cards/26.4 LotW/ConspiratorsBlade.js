import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ConspiratorsBlade extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.parent && this.parent.isParticipating(),
            targetLocation: 'any',
            match: (card) => card.getType() === 'event' && card.controller === this.controller,
            effect: ability.effects.cannotBeCanceled()
        });
        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card === this
            },
            message:
                '{player} uses {source} to reduce the cost of the next card they bring out of shadows this phase by 2',
            gameAction: GameActions.genericHandler(() => {
                this.untilEndOfPhase((ability) => ({
                    targetController: 'current',
                    effect: ability.effects.reduceNextOutOfShadowsCardCost(2)
                }));
            })
        });
    }
}

ConspiratorsBlade.code = '26070';

export default ConspiratorsBlade;
