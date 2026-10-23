import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ADragonIsNoSlave extends DrawCard {
    // A Dragon Is No Slave (06034)
    // Challenges Action: Choose a character without attachments. That character gets -2 STR until
    // the end of the phase.
    // Reaction: After you win a challenge in which you control a participating Dragon character or
    // Daenerys Targaryen, pay 1 gold to return A Dragon Is No Slave from your discard pile to your
    // hand.
    setupCardAbilities(ability) {
        this.action({
            title: 'Give -2 STR',
            phase: 'challenge',
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.attachments.length === 0,
                gameAction: 'decreaseStrength'
            },
            message: '{player} plays {source} to give {target} -2 STR until the end of the phase',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.target,
                effect: ability.effects.modifyStrength(-2)
            }))
        });
        this.reaction({
            location: 'discard pile',
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player &&
                    context.player.anyCardsInPlay(
                        (card) =>
                            card.isParticipating() &&
                            (card.hasTrait('Dragon') || card.name === 'Daenerys Targaryen') &&
                            card.getType() === 'character'
                    )
            },
            ignoreEventCosts: true,
            cost: ability.costs.payGold(1),
            message: '{player} pays 1 gold to move {source} back to their hand',
            gameAction: GameActions.returnCardToHand((context) => ({ card: context.source }))
        });
    }
}

ADragonIsNoSlave.code = '06034';

export default ADragonIsNoSlave;
