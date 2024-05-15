import DrawCard from '../../drawcard.js';

class SerColenOfGreenpools extends DrawCard {
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
