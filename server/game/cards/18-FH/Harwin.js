import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

function participatingNonLoyalCharacter(source) {
    let cards = source.controller.filterCardsInPlay((card) => {
        return card.isParticipating() && !card.isLoyal() && card.getType() === 'character';
    });

    return cards.length >= 1;
}

class Harwin extends DrawCard {
    // Harwin (18012)
    // Bestow (2). No attachments except Warhorse.
    // Action: During a challenge in which you control a participating non-loyal character, discard
    // 1 gold from Harwin to choose a character you control with 2 or more keywords and have it
    // participate in the challenge on your side. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard 1 gold',
            phase: 'challenge',
            limit: ability.limit.perPhase(1),
            condition: (context) =>
                context.game.isDuringChallenge() && participatingNonLoyalCharacter(context.source),
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.source.controller &&
                    card.getType() === 'character' &&
                    !card.isParticipating() &&
                    card.getKeywords().length >= 2
            },
            cost: ability.costs.discardGold(1),
            message:
                '{player} uses {source} to have {target} participate in the challenge on their side',
            gameAction: GameActions.addToChallenge((context) => ({
                card: context.target,
                player: context.player
            }))
        });
    }
}

Harwin.code = '18012';

export default Harwin;
