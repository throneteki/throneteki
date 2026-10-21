import DrawCard from '../../drawcard.js';

class SerAxellFlorent extends DrawCard {
    // Ser Axell Florent (06067)
    // Bestow (3).
    // Reaction: After you win a challenge in which Ser Axell Florent is participating, discard 1
    // gold from him to choose and kneel a character without attachments.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller && this.isParticipating()
            },
            cost: ability.costs.discardGold(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.attachments.length === 0
            },
            handler: (context) => {
                context.target.controller.kneelCard(context.target);
                this.game.addMessage(
                    '{0} discards 1 gold from {1} to kneel {2}',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

SerAxellFlorent.code = '06067';

export default SerAxellFlorent;
