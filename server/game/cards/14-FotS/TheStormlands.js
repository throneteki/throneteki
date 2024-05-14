import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheStormlands extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.mayInitiateAdditionalChallenge('power')
        });

        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.isMatch({ winner: this.controller, challengeType: 'power' })
            },
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.isParticipating() &&
                    card.getType() === 'character' &&
                    (card.hasTrait('King') || card.hasTrait('Queen')),
                gameAction: 'stand'
            },
            message: '{player} kneels {source} to stand {target}',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.standCard((context) => ({ card: context.target })),
                    context
                );
            }
        });
    }
}

TheStormlands.code = '14017';

export default TheStormlands;
