import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ForAllTheNightsToCome extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.strengthDifference >= 5
            },
            max: ability.limit.perPhase(1),
            targets: {
                builder: {
                    cardCondition: (card) => this.hasTraitAndCanGainPower(card, 'Builder')
                },
                ranger: {
                    cardCondition: (card) => this.hasTraitAndCanGainPower(card, 'Ranger')
                },
                steward: {
                    cardCondition: (card) => this.hasTraitAndCanGainPower(card, 'Steward')
                }
            },
            message: {
                format: '{player} plays {source} to have {targets} each gain 1 power',
                args: { targets: (context) => this.getCharactersToGainPower(context) }
            },
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.simultaneously((context) =>
                        this.getCharactersToGainPower(context).map((card) =>
                            GameActions.gainPower({ card })
                        )
                    ),
                    context
                );
            }
        });
    }

    hasTraitAndCanGainPower(card, trait) {
        return (
            card.location === 'play area' &&
            card.getType() === 'character' &&
            card.hasTrait(trait) &&
            GameActions.gainPower({ card }).allow()
        );
    }

    getCharactersToGainPower(context) {
        // A character with multiple of the traits may fill multiple slots, but only gains 1 power
        return [
            ...new Set([context.targets.builder, context.targets.ranger, context.targets.steward])
        ];
    }
}

ForAllTheNightsToCome.code = '27030';

export default ForAllTheNightsToCome;
