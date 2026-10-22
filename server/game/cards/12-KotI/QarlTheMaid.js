import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class QarlTheMaid extends DrawCard {
    // Qarl the Maid (12009)
    // Reaction: After you win a challenge in which Qarl the Maid is participating, either: stand a
    // Warship location, or stand Asha Greyjoy.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    context.source.isParticipating()
            },
            target: {
                type: 'select',
                activePromptTitle: 'Select a card',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.kneeled &&
                    ((card.getType() === 'location' && card.hasTrait('Warship')) ||
                        card.name === 'Asha Greyjoy'),
                gameAction: 'stand'
            },
            message: '{player} uses {source} to stand {target}',
            gameAction: GameActions.standCard((context) => ({ card: context.target }))
        });
    }
}

QarlTheMaid.code = '12009';

export default QarlTheMaid;
