import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import TextHelper from '../../TextHelper.js';

class JeweledTiara extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Lady' });

        this.whileAttached({
            effect: ability.effects.addTrait('Queen')
        });

        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.isMatch({
                        challengeType: 'intrigue',
                        winner: this.controller
                    }) &&
                    !!this.parent &&
                    this.parent.isParticipating()
            },
            cost: ability.costs.kneelSelf(),
            message: {
                format: "{player} uses {source} to discard {amount} at random from {loser}'s hand",
                args: {
                    amount: (context) => TextHelper.count(this.getAmount(context), 'card'),
                    loser: (context) => context.event.challenge.loser
                }
            },
            gameAction: GameActions.discardAtRandom((context) => ({
                player: context.event.challenge.loser,
                amount: this.getAmount(context)
            }))
        });
    }

    getAmount(context) {
        return context.event.challenge.strengthDifference >= 10 ? 3 : 1;
    }
}

JeweledTiara.code = '27006';

export default JeweledTiara;
