import DrawCard from '../../drawcard.js';

class KingStannisHost extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.name === 'Stannis Baratheon',
            effect: ability.effects.addKeyword('stealth')
        });

        this.persistentEffect({
            condition: () => this.game.isDuringChallenge({ challengeType: 'power' }),
            match: (card) => card.isParticipating() && card.controller !== this.controller,
            targetController: 'any',
            effect: ability.effects.modifyStrength(-1)
        });
    }
}

KingStannisHost.code = '21001';

export default KingStannisHost;
