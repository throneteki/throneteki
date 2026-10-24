import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

function isStarkCardParticipatingInChallenge(source) {
    return source.controller.anyCardsInPlay(
        (card) => card.isParticipating() && card.isFaction('stark')
    );
}

function isDirewolfOrHasAttachment(source, card) {
    return (
        card.hasTrait('Direwolf') ||
        card.attachments.some((attachment) => attachment.hasTrait('Direwolf'))
    );
}

class WinterfellKennelMaster extends DrawCard {
    // Winterfell Kennel Master (02021)
    // Challenges Action: If you control a participating [stark] character, kneel a Direwolf
    // character or a character with a Direwolf attachment to have it participate in the current
    // challenge on your side. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel a Direwolf to have it participate in the current challenge',
            phase: 'challenge',
            limit: ability.limit.perPhase(1),
            condition: (context) => isStarkCardParticipatingInChallenge(context.source),
            cost: ability.costs.kneel(
                (card, context) =>
                    isDirewolfOrHasAttachment(context.source, card) &&
                    card.canParticipateInChallenge()
            ),
            message: '{player} uses {source} to kneel {costs.kneel} and add them to the challenge',
            gameAction: GameActions.addToChallenge((context) => ({
                card: context.costs.kneel,
                player: context.player
            }))
        });
    }
}

WinterfellKennelMaster.code = '02021';

export default WinterfellKennelMaster;
