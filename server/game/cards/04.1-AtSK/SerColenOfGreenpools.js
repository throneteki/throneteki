import DrawCard from '../../drawcard.js';

class SerColenOfGreenpools extends DrawCard {
    // Ser Colen of Greenpools (04004)
    // During [power] challenges, Ser Colen of Greenpools gets +3 STR.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.isDuringChallenge({ challengeType: 'power' }),
            match: this,
            effect: ability.effects.modifyStrength(3)
        });
    }
}

SerColenOfGreenpools.code = '04004';

export default SerColenOfGreenpools;
