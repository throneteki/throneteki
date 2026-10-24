import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class JonSnow extends DrawCard {
    // Jon Snow (07001)
    // Stealth.
    // Reaction: After you win a challenge in which Jon Snow is participating, either: stand each
    // attacking Wildling character, or stand each defending [thenightswatch] character. (Limit once
    // per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player &&
                    event.challenge.isParticipating(context.source)
            },
            limit: ability.limit.perPhase(1),
            message: {
                format: '{player} uses {source} to stand {characters}',
                args: { characters: (context) => jonsCharacters(context) }
            },
            gameAction: GameActions.simultaneously((context) =>
                jonsCharacters(context).map((card) => GameActions.standCard({ card }))
            )
        });
    }
}

function jonsCharacters(context) {
    const challenge = context.event.challenge;
    if (challenge.attackingPlayer === context.player) {
        return challenge.attackers.filter(
            (card) => card.hasTrait('Wildling') && card.getType() === 'character'
        );
    }
    return challenge.defenders.filter(
        (card) => card.isFaction('thenightswatch') && card.getType() === 'character'
    );
}

JonSnow.code = '07001';

export default JonSnow;
