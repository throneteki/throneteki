import DrawCard from '../../drawcard.js';

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
            condition: () => this.game.isDuringChallenge() && this.participatingNonLoyalCharacter(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.controller === this.controller &&
                    card.getType() === 'character' &&
                    !card.isParticipating() &&
                    card.getKeywords().length >= 2
            },
            cost: ability.costs.discardGold(1),
            handler: (context) => {
                this.game.currentChallenge.addParticipantToSide(context.player, context.target);
                this.game.addMessage(
                    '{0} uses {1} to have {2} participate in the challenge on their side',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }

    participatingNonLoyalCharacter() {
        let cards = this.controller.filterCardsInPlay((card) => {
            return card.isParticipating() && !card.isLoyal() && card.getType() === 'character';
        });

        return cards.length >= 1;
    }
}

Harwin.code = '18012';

export default Harwin;
