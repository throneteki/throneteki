import DrawCard from '../../drawcard.js';

class BowenMarsh extends DrawCard {
    // Bowen Marsh (07002)
    // During [intrigue] challenges, each Steward character you control gains insight.
    // +1 Reserve.
    setupCardAbilities(ability) {
        this.plotModifiers({
            reserve: 1
        });
        this.persistentEffect({
            condition: () => this.game.isDuringChallenge({ challengeType: 'intrigue' }),
            match: (card) => card.hasTrait('Steward') && card.getType() === 'character',
            effect: ability.effects.addKeyword('Insight')
        });
    }
}

BowenMarsh.code = '07002';

export default BowenMarsh;
