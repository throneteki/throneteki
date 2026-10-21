import DrawCard from '../../drawcard.js';

class PoisonedLocusts extends DrawCard {
    // Poisoned Locusts (26094)
    // Opponent's character only. Shadow (0). Terminal.
    // While attached character is participating in a challenge, it gets -1 STR for each attachment
    // it has and is killed if its STR is 0.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ controller: 'opponent' });
        this.whileAttached({
            condition: () => this.parent.isParticipating(),
            effect: ability.effects.killByDynamicStrength(() => this.parent.attachments.length)
        });
    }
}

PoisonedLocusts.code = '26094';

export default PoisonedLocusts;
