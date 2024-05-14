const DrawCard = require('../../drawcard.js');

class Winterfell extends DrawCard {
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

module.exports = Winterfell;
