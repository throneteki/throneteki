import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class OlennasMachinations extends DrawCard {
    // Olenna's Machinations (06084)
    // Challenges Action: You may initiate an additional [power] challenge this phase. (Max 1 per
    // phase.)
    // Reaction: After you win an [intrigue] challenge by 5 or more STR, pay 1 gold to return
    // Olenna's Machinations from your discard pile to your hand.
    setupCardAbilities(ability) {
        this.action({
            max: ability.limit.perPhase(1),
            title: 'Raise power challenge limit',
            phase: 'challenge',
            message:
                '{player} plays {source} to be able to initiate an additional power challenge this phase',
            gameAction: GameActions.lastingEffect(() => ({
                duration: 'untilEndOfPhase',
                targetController: 'current',
                effect: ability.effects.mayInitiateAdditionalChallenge('power')
            }))
        });

        this.reaction({
            location: 'discard pile',
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player &&
                    event.challenge.challengeType === 'intrigue' &&
                    event.challenge.strengthDifference >= 5
            },
            ignoreEventCosts: true,
            cost: ability.costs.payGold(1),
            message: '{player} pays 1 gold to return {source} to their hand',
            gameAction: GameActions.returnCardToHand((context) => ({ card: context.source }))
        });
    }
}

OlennasMachinations.code = '06084';

export default OlennasMachinations;
