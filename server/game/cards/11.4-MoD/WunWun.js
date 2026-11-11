import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

function isWildlingdParticipatingInChallenge(source) {
    return source.controller.anyCardsInPlay(
        (card) => card.isParticipating() && card.hasTrait('wildling')
    );
}

class WunWun extends DrawCard {
    // Wun Wun (11077)
    // No attachments except Weapon.
    // Action: Kneel Wun Wun to have him participate in a challenge in which you control a
    // participating Wildling character.
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel Wun Wun to have him participate in the current challenge',
            condition: (context) => isWildlingdParticipatingInChallenge(context.source),
            cost: ability.costs.kneelSelf(),
            message: '{player} uses {source} to kneel {source} and add them to the challenge',
            gameAction: GameActions.addToChallenge((context) => ({
                card: context.source,
                player: context.player
            }))
        });
    }
}

WunWun.code = '11077';

export default WunWun;
