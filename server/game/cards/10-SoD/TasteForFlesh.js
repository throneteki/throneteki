import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TasteForFlesh extends DrawCard {
    // Taste For Flesh (10034)
    // Reaction: After you win a challenge in which you control an attacking Direwolf character or
    // an attacking character with a Direwolf attachment, choose and kill a defending character.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    context.source.isAttackingDirewolfOrHasAttachment()
            },
            target: {
                cardCondition: (card) => card.isDefending(),
                gameAction: 'kill'
            },
            message: '{player} plays {source} to kill {target}',
            gameAction: GameActions.kill((context) => ({ card: context.target }))
        });
    }

    isAttackingDirewolfOrHasAttachment() {
        return this.controller.anyCardsInPlay(
            (card) =>
                card.isAttacking() &&
                (card.hasTrait('Direwolf') ||
                    card.attachments.some((attachment) => attachment.hasTrait('Direwolf')))
        );
    }
}

TasteForFlesh.code = '10034';

export default TasteForFlesh;
