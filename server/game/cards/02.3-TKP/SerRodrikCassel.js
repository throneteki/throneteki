import DrawCard from '../../drawcard.js';

class SerRodrikCassel extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                this.isAttacking() && this.game.isDuringChallenge({ challengeType: 'military' }),
            match: (card) => card.isUnique() && card.isFaction('stark'),
            effect: ability.effects.addKeyword('Insight')
        });
    }
}

SerRodrikCassel.code = '02041';

export default SerRodrikCassel;
