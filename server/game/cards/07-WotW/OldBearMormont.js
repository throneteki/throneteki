import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class OldBearMormont extends DrawCard {
    // Old Bear Mormont (07003)
    // Reaction: After you win a challenge in which Old Bear Mormont is participating, choose a
    // non-unique character in the losing opponent's discard pile, and put it into play under your
    // control.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    context.source.isParticipating()
            },
            target: {
                cardCondition: (card, context) =>
                    !card.isUnique() &&
                    card.getType() === 'character' &&
                    card.controller === context.event.challenge.loser &&
                    card.location === 'discard pile' &&
                    context.source.controller.canPutIntoPlay(card)
            },
            message: {
                format: "{player} uses {source} to put {target} into play under their control from {originalPlayer}'s discard pile",
                args: { originalPlayer: (context) => context.target.controller }
            },
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.target
            }))
        });
    }
}

OldBearMormont.code = '07003';

export default OldBearMormont;
