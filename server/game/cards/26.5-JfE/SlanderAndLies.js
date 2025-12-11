import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SlanderAndLies extends DrawCard {
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
