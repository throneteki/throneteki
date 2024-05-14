const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class MaceTyrell extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand and remove Army',
            condition: () => this.game.isDuringChallenge(),
            cost: [
                ability.costs.stand((card) => card.hasTrait('Army') && card.isParticipating()),
                ability.costs.removeFromChallenge(
                    (card) => card.hasTrait('Army') && card.isParticipating()
                )
            ],
            target: {
                cardCondition: (card, context) =>
                    card.isParticipating() &&
                    (!context.costs.stand ||
                        (card !== context.costs.stand &&
                            card.getPrintedCost() <= context.costs.stand.getPrintedCost()))
            },
            limit: ability.limit.perPhase(1),
            message:
                '{player} uses {source}, stands and removes {cost.stand} from the challenge to stand and remove {target} from the challenge',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.simultaneously([
                        GameActions.standCard({ card: context.target }),
                        GameActions.removeFromChallenge({ card: context.target })
                    ]),
                    context
                );
            }
        });
    }
}

MaceTyrell.code = '24022';

module.exports = MaceTyrell;
