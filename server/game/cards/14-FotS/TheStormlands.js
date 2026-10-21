import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheStormlands extends DrawCard {
    // The Stormlands (14017)
    // You may initiate an additional [power] challenge during the challenges phase.
    // Reaction: After you win a [power] challenge, kneel The Stormlands to choose and stand a
    // participating King or Queen character.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.mayInitiateAdditionalChallenge('power')
        });

        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.isMatch({
                        winner: context.source.controller,
                        challengeType: 'power'
                    })
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
            gameAction: GameActions.standCard((context) => ({ card: context.target }))
        });
    }
}

TheStormlands.code = '14017';

export default TheStormlands;
