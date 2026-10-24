import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import TextHelper from '../../TextHelper.js';

class JeweledTiara extends DrawCard {
    // Jeweled Tiara (27006)
    // Lady character only.
    // Attached character gains the Queen trait.
    // Reaction: After you win an [intrigue] challenge in which attached character is participating,
    // kneel Jeweled Tiara to discard 1 card at random from the losing opponent's hand. (3 cards
    // instead if you won by 10 or more STR.)
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Lady' });

        this.whileAttached({
            effect: ability.effects.addTrait('Queen')
        });

        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.isMatch({
                        challengeType: 'intrigue',
                        winner: context.source.controller
                    }) &&
                    !!context.source.parent &&
                    context.source.parent.isParticipating()
            },
            cost: ability.costs.kneelSelf(),
            message: {
                format: "{player} uses {source} to discard {amount} at random from {loser}'s hand",
                args: {
                    amount: (context) =>
                        TextHelper.count(context.source.getAmount(context), 'card'),
                    loser: (context) => context.event.challenge.loser
                }
            },
            gameAction: GameActions.discardAtRandom((context) => ({
                player: context.event.challenge.loser,
                amount: context.source.getAmount(context)
            }))
        });
    }

    getAmount(context) {
        return context.event.challenge.strengthDifference >= 10 ? 3 : 1;
    }
}

JeweledTiara.code = '27006';

export default JeweledTiara;
