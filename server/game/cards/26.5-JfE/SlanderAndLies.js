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
                afterChallenge: (event, context) =>
                    event.challenge.loser === context.source.controller &&
                    event.challenge.isParticipating(context.source.parent)
            },
            message: {
                format: '{player} is forced to have {parent} gain 1 power',
                args: { parent: (context) => context.source.parent }
            },
            gameAction: GameActions.gainPower((context) => ({
                card: context.source.parent,
                amount: 1
            }))
        });
    }
}

SlanderAndLies.code = '26086';

export default SlanderAndLies;
