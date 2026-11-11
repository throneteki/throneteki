import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

function calculateAmount(source) {
    return (
        source.game.currentChallenge.getNumberOfParticipants(
            (card) => card.controller === source.controller
        ) * 2
    );
}

class TheEyrie extends DrawCard {
    // The Eyrie (23031)
    // While your initiative value is 0, The Eyrie is immune to opponents' non-plot card effects.
    // Challenges Action: During a challenge in which you control a participating loyal or House
    // Arryn character, kneel The Eyrie to have it contribute 2 STR to your side this challenge for
    // each participating character you control.
    // -2 Initiative. +1 Reserve.
    setupCardAbilities(ability) {
        this.plotModifiers({
            initiative: -2,
            reserve: 1
        });

        this.persistentEffect({
            condition: (context) => context.source.controller.getInitiative() === 0,
            match: this,
            effect: ability.effects.immuneTo(
                (card, arg, context) =>
                    card.controller !== context.source.controller && card.getType() !== 'plot'
            )
        });

        this.action({
            title: 'Contribute STR',
            phase: 'challenge',
            cost: ability.costs.kneelSelf(),
            condition: (context) =>
                context.game.isDuringChallenge() &&
                context.game.currentChallenge.anyParticipants(
                    (card) =>
                        card.controller === context.source.controller &&
                        (card.isLoyal() || card.hasTrait('House Arryn'))
                ),
            message: {
                format: "{player} kneels {source} to have it contribute {amount} STR to {player}'s side of the challenge",
                args: { amount: (context) => calculateAmount(context.source) }
            },
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfChallenge',
                targetController: 'current',
                effect: ability.effects.contributeStrength(
                    context.source,
                    calculateAmount(context.source)
                )
            }))
        });
    }
}

TheEyrie.code = '23031';

export default TheEyrie;
