import DrawCard from '../../drawcard.js';

class SerJaimeLannister extends DrawCard {
    // Ser Jaime Lannister (01087)
    // Ser Jaime Lannister does not kneel when declared as an attacker in a [military] challenge,
    // and gains renown while participating in a [military] challenge.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: [ability.effects.doesNotKneelAsAttacker({ challengeType: 'military' })]
        });
        this.persistentEffect({
            condition: () =>
                this.game.isDuringChallenge({ challengeType: 'military' }) &&
                this.isParticipating(),
            match: this,
            effect: [ability.effects.addKeyword('Renown')]
        });
    }
}

SerJaimeLannister.code = '01087';

export default SerJaimeLannister;
