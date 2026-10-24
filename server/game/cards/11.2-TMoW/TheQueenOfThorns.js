import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheQueenOfThorns extends DrawCard {
    // The Queen of Thorns (11023)
    // Shadow (4). Stealth.
    // Reaction: After you win a challenge in which The Queen of Thorns is participating, choose a
    // card you control in shadows and put it into play.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    context.source.isParticipating()
            },
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card, context) =>
                    card.location === 'shadows' &&
                    card.controller === context.source.controller &&
                    context.source.controller.canPutIntoPlay(card)
            },
            message: '{player} uses {source} to put {target} into play',
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.target,
                playingType: 'outOfShadows'
            }))
        });
    }
}

TheQueenOfThorns.code = '11023';

export default TheQueenOfThorns;
