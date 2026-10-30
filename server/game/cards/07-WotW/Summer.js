import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Summer extends DrawCard {
    // Summer (07034)
    // Unique [stark] character only.
    // Action: Kneel attached character to have it participate in a [military] challenge on your
    // side. (Limit once per challenge.)
    // Action: Pay 1 gold to attach Summer to a different character. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'stark', unique: true });
        this.action({
            title: 'Add attached character to the challenge',
            condition: (context) => context.game.isDuringChallenge({ challengeType: 'military' }),
            cost: ability.costs.kneelParent(),
            limit: ability.limit.perChallenge(1),
            message:
                '{player} uses {source} and kneels {costs.kneel} to have it participate in the challenge on their side',
            gameAction: GameActions.addToChallenge((context) => ({
                card: context.source.parent,
                player: context.player
            }))
        });
        this.action({
            title: 'Attach Summer to another character',
            cost: ability.costs.payGold(1),
            target: {
                type: 'select',
                cardCondition: { location: 'play area', type: 'character' }
            },
            limit: ability.limit.perPhase(1),
            message: '{player} pays 1 gold to attach {source} to {target}',
            gameAction: GameActions.attach((context) => ({
                attachment: context.source,
                target: context.target
            }))
        });
    }
}

Summer.code = '07034';

export default Summer;
