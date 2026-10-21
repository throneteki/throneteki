import DrawCard from '../../drawcard.js';

class QarlTheMaid extends DrawCard {
    // Qarl the Maid (12009)
    // Reaction: After you win a challenge in which Qarl the Maid is participating, either: stand a
    // Warship location, or stand Asha Greyjoy.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller && this.isParticipating()
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
            handler: (context) => {
                this.game.addMessage(
                    '{0} uses {1} to stand {2}',
                    context.player,
                    this,
                    context.target
                );
                this.controller.standCard(context.target);
            }
        });
    }
}

QarlTheMaid.code = '12009';

export default QarlTheMaid;
