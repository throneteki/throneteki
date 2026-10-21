import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheBastardOfDriftmark extends DrawCard {
    // The Bastard of Driftmark (13109)
    // Reaction: After you win an [intrigue] challenge in which The Bastard of Driftmark is
    // participating, choose and stand a location.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    this.isParticipating() &&
                    event.challenge.challengeType === 'intrigue'
            },
            target: {
                activePromptTitle: 'Select a location',
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'location' && card.kneeled,
                gameAction: 'stand'
            },
            message: '{player} uses {source} to stand {target}',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.standCard((context) => ({ card: context.target })),
                    context
                );
            }
        });
    }
}

TheBastardOfDriftmark.code = '13109';

export default TheBastardOfDriftmark;
