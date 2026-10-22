import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SerAxellFlorent extends DrawCard {
    // Ser Axell Florent (06067)
    // Bestow (3).
    // Reaction: After you win a challenge in which Ser Axell Florent is participating, discard 1
    // gold from him to choose and kneel a character without attachments.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    context.source.isParticipating()
            },
            cost: ability.costs.discardGold(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.attachments.length === 0
            },
            message: '{player} discards 1 gold from {source} to kneel {target}',
            gameAction: GameActions.kneelCard((context) => ({ card: context.target }))
        });
    }
}

SerAxellFlorent.code = '06067';

export default SerAxellFlorent;
