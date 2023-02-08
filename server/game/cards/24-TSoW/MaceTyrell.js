const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class MaceTyrell extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand and remove Army',
            condition: () => this.game.isDuringChallenge(),
            target: {
                cardCondition: card => card.isParticipating() && this.isControlledArmy(card)
            },
            limit: ability.limit.perPhase(1),
            message: '{player} uses {source} to stand and remove {target} from the challenge',
            handler: context => {
                this.game.resolveGameAction(
                    GameActions.simultaneously([
                        GameActions.standCard({ card: context.target }),
                        GameActions.removeFromChallenge({ card: context.target })
                    ]).then({
                        target: {
                            cardCondition: (card, context) => card !== context.parentContext.target && !card.isParticipating() && this.isControlledArmy(card)
                        },
                        message: 'Then, {player} kneels {target} to have it participate in the challenge on their side',
                        handler: context => {
                            this.game.resolveGameAction(
                                GameActions.simultaneously([
                                    GameActions.kneelCard({ card: context.target }),
                                    GameActions.genericHandler(context => {
                                        this.game.currentChallenge.addParticipantToSide(this.controller, context.target);
                                    })
                                ])
                                , context);
                        }
                    })
                    , context);
            }
        });
    }
    
    isControlledArmy(card) {
        return card.controller === this.controller && card.getType() === 'character' && card.hasTrait('Army');
    }
}

MaceTyrell.code = '24022';

module.exports = MaceTyrell;
