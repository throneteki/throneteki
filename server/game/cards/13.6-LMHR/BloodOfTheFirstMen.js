import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

function isStarkCardParticipatingInChallenge(source) {
    return source.controller.anyCardsInPlay(
        (card) => card.isParticipating() && card.isFaction('stark')
    );
}

class BloodOfTheFirstMen extends DrawCard {
    // Blood of the First Men (13102)
    // Character you control only.
    // Attached character gains the Old Gods trait.
    // Action: During a challenge in which you control a participating [stark] character, kneel
    // attached character to have it participate in the challenge on your side.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ controller: 'current' });
        this.whileAttached({
            effect: ability.effects.addTrait('Old Gods')
        });
        this.action({
            title: 'Participate in challenge',
            condition: (context) =>
                isStarkCardParticipatingInChallenge(context.source) &&
                context.source.parent.canParticipateInChallenge(),
            cost: ability.costs.kneelParent(),
            message: {
                format: '{player} uses {source} and kneels {parent} to add them to the challenge',
                args: { parent: (context) => context.source.parent }
            },
            gameAction: GameActions.addToChallenge((context) => ({
                card: context.source.parent,
                player: context.player
            }))
        });
    }
}

BloodOfTheFirstMen.code = '13102';

export default BloodOfTheFirstMen;
