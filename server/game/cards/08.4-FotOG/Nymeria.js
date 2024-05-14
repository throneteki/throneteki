import DrawCard from '../../drawcard.js';

class Nymeria extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Add Direwolfs to challenge',
            condition: () => this.isStarkCardParticipatingInChallenge(),
            cost: [
                ability.costs.kneelSelf(),
                ability.costs.kneelAny(
                    (card) =>
                        card.hasTrait('Direwolf') &&
                        card.getType() === 'character' &&
                        card !== this,
                    true
                )
            ],
            handler: (context) => {
                let direwolvesToAdd = context.getCostValuesFor('kneel');

                for (let card of direwolvesToAdd) {
                    this.game.currentChallenge.addParticipantToSide(context.player, card);
                }

                this.game.addMessage(
                    '{0} kneels {1} to add them to the challenge',
                    context.player,
                    direwolvesToAdd
                );
            }
        });
    }

    isStarkCardParticipatingInChallenge() {
        return this.controller.anyCardsInPlay((card) => {
            return card.isParticipating() && card.isFaction('stark');
        });
    }
}

Nymeria.code = '08061';

export default Nymeria;
