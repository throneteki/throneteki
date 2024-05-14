import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheHornThatWakesTheSleepers extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onChallengeInitiated: (event) =>
                    event.challenge.isMatch({ initiatedAgainstPlayer: this.controller })
            },
            targets: {
                builder: {
                    cardCondition: (card) => this.isKneeledWithTrait(card, 'Builder'),
                    gameAction: 'stand'
                },
                ranger: {
                    cardCondition: (card) => this.isKneeledWithTrait(card, 'Ranger'),
                    gameAction: 'stand'
                },
                steward: {
                    cardCondition: (card) => this.isKneeledWithTrait(card, 'Steward'),
                    gameAction: 'stand'
                }
            },
            message: {
                format: '{player} plays {source} to stand {targets}',
                args: { targets: (context) => this.getCharactersToStand(context) }
            },
            handler: (context) => {
                let targets = this.getCharactersToStand(context);
                this.game.resolveGameAction(
                    GameActions.simultaneously(
                        targets.map((card) => GameActions.standCard({ card }))
                    )
                );
            }
        });
    }

    isKneeledWithTrait(card, trait) {
        return (
            card.location === 'play area' &&
            card.controller === this.controller &&
            card.getType() === 'character' &&
            card.kneeled &&
            card.hasTrait(trait)
        );
    }

    getCharactersToStand(context) {
        return [context.targets.builder, context.targets.ranger, context.targets.steward];
    }
}

TheHornThatWakesTheSleepers.code = '14032';

export default TheHornThatWakesTheSleepers;
