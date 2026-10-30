import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BranStark extends DrawCard {
    // Bran Stark (22016)
    // Each Old Gods character you control cannot be knelt by card effects.
    // Interrupt: When claim is applied for an [intrigue] challenge in which you control a
    // participating Old Gods character, instead of the normal claim effects, look at the defending
    // player's hand. Choose and discard X cards from that hand, if able. X is the claim value on
    // the attacking player's revealed plot card.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) =>
                card.getType() === 'character' &&
                card.hasTrait('Old Gods') &&
                card.controller === context.source.controller,
            effect: ability.effects.cannotBeKneeled(
                (context) => context.resolutionStage === 'effect'
            )
        });
        this.interrupt({
            when: {
                onClaimApplied: (event, context) =>
                    !!event.challenge &&
                    event.challenge.isMatch({ challengeType: 'intrigue' }) &&
                    event.challenge.defendingPlayer.hand.length !== 0 &&
                    event.challenge
                        .getParticipants()
                        .some(
                            (card) =>
                                card.controller === context.player && card.hasTrait('Old Gods')
                        )
            },
            message: {
                format: "{player} uses {source} to look at {defendingPlayer}'s hand instead of the normal claim effects",
                args: { defendingPlayer: (context) => context.event.challenge.defendingPlayer }
            },
            gameAction: GameActions.replaceEvent((context) => ({
                event: context.event,
                replacement: GameActions.chooseCards({
                    mode: 'exactly',
                    numCards: context.event.challenge.winner.getClaim(),
                    revealTargets: true,
                    title: 'Select cards to discard',
                    cardCondition: (card) =>
                        card.location === 'hand' &&
                        card.controller === context.event.challenge.defendingPlayer,
                    gameAction: (card) => GameActions.discardCard({ card })
                })
            }))
        });
    }
}

BranStark.code = '22016';

export default BranStark;
