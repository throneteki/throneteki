import DrawCard from '../../drawcard.js';

class SecretPact extends DrawCard {
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
