import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class AttackFromTheMountains extends DrawCard {
    // Attack From the Mountains (06010)
    // Reaction: After you win a challenge in which you control an attacking Clansman character, put
    // a Clansman character into play from your hand.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    context.source.hasAttackingClansman()
            },
            target: {
                cardCondition: (card, context) =>
                    card.owner === context.source.controller &&
                    card.location === 'hand' &&
                    card.hasTrait('Clansman') &&
                    card.getType() === 'character' &&
                    context.source.controller.canPutIntoPlay(card)
            },
            message: '{player} plays {source} to put {target} into play from their hand',
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.target.owner,
                card: context.target
            }))
        });
    }

    hasAttackingClansman() {
        return this.controller.anyCardsInPlay(
            (card) =>
                card.isAttacking() && card.hasTrait('Clansman') && card.getType() === 'character'
        );
    }
}

AttackFromTheMountains.code = '06010';

export default AttackFromTheMountains;
