const DrawCard = require('../../drawcard.js');

class Summer extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'stark', unique: true });
        this.action({
            title: 'Add attached character to the challenge',
            condition: () => this.game.isDuringChallenge({ challengeType: 'military' }),
            cost: ability.costs.kneelParent(),
            limit: ability.limit.perChallenge(1),
            handler: () => {
                this.game.currentChallenge.addParticipantToSide(this.controller, this.parent);
                this.game.addMessage(
                    '{0} uses {1} and kneels {2} to have {2} participate in the challenge on their side',
                    this.controller,
                    this,
                    this.parent
                );
            }
        });
        this.action({
            title: 'Attach Summer to another character',
            cost: ability.costs.payGold(1),
            limit: ability.limit.perPhase(1),
            target: {
                type: 'select',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card !== this.parent &&
                    this.controller.canAttach(this, card)
            },
            handler: (context) => {
                this.controller.attach(this.controller, this, context.target);
                this.game.addMessage(
                    '{0} pays 1 gold to attach {1} to {2}',
                    this.controller,
                    this,
                    this.parent
                );
            }
        });
    }
}

Summer.code = '07034';

module.exports = Summer;
