import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

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
            condition: () => this.controller.getInitiative() === 0,
            match: this,
            effect: ability.effects.immuneTo(
                (card) => card.controller !== this.controller && card.getType() !== 'plot'
            )
        });

        this.action({
            title: 'Contribute STR',
            phase: 'challenge',
            cost: ability.costs.kneelSelf(),
            condition: () =>
                this.game.isDuringChallenge() &&
                this.game.currentChallenge.anyParticipants(
                    (card) =>
                        card.controller === this.controller &&
                        (card.isLoyal() || card.hasTrait('House Arryn'))
                ),
            message: {
                format: "{player} kneels {source} to have it contribute {amount} STR to {player}'s side of the challenge",
                args: { amount: () => this.calculateAmount() }
            },
            gameAction: GameActions.genericHandler(() => {
                this.untilEndOfChallenge((ability) => ({
                    targetController: 'current',
                    effect: ability.effects.contributeStrength(this, this.calculateAmount())
                }));
            })
        });
    }

    calculateAmount() {
        return (
            this.game.currentChallenge.getNumberOfParticipants(
                (card) => card.controller === this.controller
            ) * 2
        );
    }
}

TheEyrie.code = '23031';

export default TheEyrie;
