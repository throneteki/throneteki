import DrawCard from '../../drawcard.js';

class SerRodrikCassel extends DrawCard {
    // Ser Rodrik Cassel (02041)
    // No attachments except Weapon.
    // While Ser Rodrik Cassel is attacking in a [military] challenge, each unique [stark] character
    // you control gains insight.
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
