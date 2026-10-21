import DrawCard from '../../drawcard.js';

class TheHauntedForest extends DrawCard {
    // The Haunted Forest (04066)
    // While The Haunted Forest is standing, it contributes 1 STR to your side during any challenge
    // in which you are the defending player.
    // Forced Reaction: After you lose a challenge, kneel The Haunted Forest.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                !this.kneeled && this.game.isDuringChallenge({ defendingPlayer: this.controller }),
            targetController: 'current',
            effect: ability.effects.contributeStrength(this, 1)
        });
        this.forcedReaction({
            when: {
                afterChallenge: (event) =>
                    this.controller === event.challenge.loser && !this.kneeled
            },
            handler: () => {
                this.game.addMessage('{0} is forced to kneel {1}', this.controller, this);
                this.controller.kneelCard(this);
            }
        });
    }
}

TheHauntedForest.code = '04066';

export default TheHauntedForest;
