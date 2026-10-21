import DrawCard from '../../drawcard.js';

class TheQueenOfThorns extends DrawCard {
    // The Queen of Thorns (11023)
    // Shadow (4). Stealth.
    // Reaction: After you win a challenge in which The Queen of Thorns is participating, choose a
    // card you control in shadows and put it into play.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller && this.isParticipating()
            },
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card) =>
                    card.location === 'shadows' &&
                    card.controller === this.controller &&
                    this.controller.canPutIntoPlay(card)
            },
            handler: (context) => {
                context.player.putIntoPlay(context.target, 'outOfShadows');
                this.game.addMessage(
                    '{0} uses {1} to put {2} into play',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }
}

TheQueenOfThorns.code = '11023';

export default TheQueenOfThorns;
