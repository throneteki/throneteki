import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheHornThatWakesTheSleepers extends DrawCard {
    // The Horn that Wakes the Sleepers (14032)
    // Reaction: After an opponent initiates a challenge against you, choose and stand a Builder
    // character, a Ranger character, and a Steward character.
    setupCardAbilities() {
        this.reaction({
            when: {
                onChallengeInitiated: (event, context) =>
                    event.challenge.isMatch({ initiatedAgainstPlayer: context.player })
            },
            targets: {
                builder: standWithTrait('Builder'),
                ranger: standWithTrait('Ranger'),
                steward: standWithTrait('Steward')
            },
            message: {
                format: '{player} plays {source} to stand {targets}',
                args: { targets: (context) => charactersToStand(context) }
            },
            gameAction: GameActions.simultaneously((context) =>
                charactersToStand(context).map((card) => GameActions.standCard({ card }))
            )
        });
    }
}

function standWithTrait(trait) {
    return {
        cardCondition: (card, context) =>
            card.location === 'play area' &&
            card.controller === context.player &&
            card.getType() === 'character' &&
            card.hasTrait(trait),
        gameAction: 'stand'
    };
}

function charactersToStand(context) {
    return [context.targets.builder, context.targets.ranger, context.targets.steward];
}

TheHornThatWakesTheSleepers.code = '14032';

export default TheHornThatWakesTheSleepers;
