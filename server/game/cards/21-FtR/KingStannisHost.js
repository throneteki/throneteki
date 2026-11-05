import DrawCard from '../../drawcard.js';

class KingStannisHost extends DrawCard {
    // King Stannis's Host (21001)
    // Assault. No attachments. Renown.
    // While you control Stannis Baratheon, he gains stealth.
    // During [power] challenges, each participating character an opponent controls gets -1 STR.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.name === 'Stannis Baratheon',
            effect: ability.effects.addKeyword('stealth')
        });

        this.persistentEffect({
            condition: (context) => context.game.isDuringChallenge({ challengeType: 'power' }),
            match: (card, context) =>
                card.isParticipating() && card.controller !== context.source.controller,
            targetController: 'any',
            effect: ability.effects.modifyStrength(-1)
        });
    }
}

KingStannisHost.code = '21001';

export default KingStannisHost;
