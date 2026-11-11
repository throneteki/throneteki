import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SpottedSylva extends DrawCard {
    // Spotted Sylva (15031)
    // Forced Reaction: After you lose a challenge in which Spotted Sylva is attacking, each player
    // must choose a participating character he or she controls, if able, and return it to its
    // owner's hand.
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.loser === context.player &&
                    event.challenge.isAttacking(context.source)
            },
            target: {
                choosingPlayer: 'each',
                ifAble: true,
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.choosingPlayer &&
                    card.getType() === 'character' &&
                    card.isParticipating(),
                gameAction: 'returnToHand'
            },
            message: '{player} is forced by {source} to have each player return {target} to hand',
            gameAction: GameActions.simultaneously((context) =>
                context.targets.getTargets().map((card) => GameActions.returnCardToHand({ card }))
            )
        });
    }
}

SpottedSylva.code = '15031';

export default SpottedSylva;
