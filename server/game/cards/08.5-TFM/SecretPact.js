import DrawCard from '../../drawcard.js';

class SecretPact extends DrawCard {
    // Secret Pact (08096)
    // Non-[martell] character only. Ambush (3).
    // Attached character gains renown.
    // Attached character cannot be declared as an attacker in challenges against you.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ not: { faction: 'martell' } });
        this.whileAttached({
            effect: ability.effects.addKeyword('Renown')
        });
        this.whileAttached({
            condition: () => this.game.isDuringChallenge({ defendingPlayer: this.controller }),
            effect: ability.effects.cannotBeDeclaredAsAttacker()
        });
    }
}

SecretPact.code = '08096';

export default SecretPact;
