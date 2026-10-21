import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SlanderAndLies extends DrawCard {
    // Slander and Lies (26086)
    // Opponent's character only. Ambush (3). Terminal.
    // You may spend each power on attached character as if it were 2 gold in your gold pool.
    // Forced Reaction: After you lose a challenge in which attached character is participating, it
    // gains 1 power.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ controller: 'opponent' });
        this.whileAttached({
            effect: ability.effects.canSpendPowerAsGold()
        });

        this.forcedReaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.loser === this.controller &&
                    event.challenge.isParticipating(this.parent)
            },
            message: {
                format: '{player} is forced to have {parent} gain 1 power',
                args: { parent: () => this.parent }
            },
            gameAction: GameActions.gainPower(() => ({ card: this.parent, amount: 1 }))
        });
    }
}

SlanderAndLies.code = '26086';

export default SlanderAndLies;
