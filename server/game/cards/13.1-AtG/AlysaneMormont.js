import DrawCard from '../../drawcard.js';
import Conditions from '../../Conditions.js';

class AlysaneMormont extends DrawCard {
    // Alysane Mormont (13001)
    // No attachments except Weapon.
    // While each character you control has the [stark] affiliation, Alysane Mormont gains stealth
    // during [military] challenges and does not kneel when declared as an attacker in a [military]
    // challenge.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                Conditions.allCharactersAreStark({ player: this.controller }) &&
                this.game.isDuringChallenge({ challengeType: 'military' }),
            match: this,
            effect: [
                ability.effects.addKeyword('stealth'),
                ability.effects.doesNotKneelAsAttacker()
            ]
        });
    }
}

AlysaneMormont.code = '13001';

export default AlysaneMormont;
