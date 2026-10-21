import DrawCard from '../../drawcard.js';

class MargaerysInfluence extends DrawCard {
    // Margaery's Influence (11005)
    // Terminal.
    // Action: While attached character is participating in a challenge, kneel Margaery's Influence
    // and pay 1 gold to stand attached character and remove it from the challenge.
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand parent and remove from challenge',
            condition: () => this.parent && this.parent.isParticipating(),
            cost: [ability.costs.kneelSelf(), ability.costs.payGold(1)],
            handler: () => {
                this.parent.controller.standCard(this.parent);
                this.game.currentChallenge.removeFromChallenge(this.parent);
                this.game.addMessage(
                    '{0} kneels {1} and pays 1 gold to stand {2} and remove it from the challenge',
                    this.controller,
                    this,
                    this.parent
                );
            }
        });
    }
}

MargaerysInfluence.code = '11005';

export default MargaerysInfluence;
