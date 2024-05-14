import DrawCard from '../../drawcard.js';
import Conditions from '../../Conditions.js';

class AlysaneMormont extends DrawCard {
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
