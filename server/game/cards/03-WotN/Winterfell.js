import DrawCard from '../../drawcard.js';

class Winterfell extends DrawCard {
    // Winterfell (03017)
    // Each [stark] character you control gets +1 STR.
    // Reaction: After a challenge is initiated, kneel Winterfell. Then, each player with a
    // non-Winter plot card revealed cannot trigger card abilities until the end of the challenge.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.isFaction('stark') && card.getType() === 'character',
            effect: ability.effects.modifyStrength(1)
        });

        this.reaction({
            when: {
                onChallengeInitiated: () => !this.kneeled
            },
            handler: () => {
                this.controller.kneelCard(this);
                this.untilEndOfChallenge((ability) => ({
                    targetController: 'any',
                    match: (player) => !player.activePlot.hasTrait('winter'),
                    effect: ability.effects.cannotTriggerCardAbilities()
                }));

                this.game.addMessage(
                    '{0} kneels {1} to prevent each player with a non-Winter plot card revealed from triggering card abilities until the end of the challenge',
                    this.controller,
                    this
                );
            }
        });
    }
}

Winterfell.code = '03017';

export default Winterfell;
