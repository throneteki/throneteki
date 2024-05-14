import DrawCard from '../../drawcard.js';

class ValyrianSteelDagger extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            condition: () => this.game.isDuringChallenge({ challengeType: 'intrigue' }),
            effect: [ability.effects.modifyStrength(2), ability.effects.addKeyword('stealth')]
        });
    }
}

ValyrianSteelDagger.code = '05021';

export default ValyrianSteelDagger;
