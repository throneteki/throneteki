import DrawCard from '../../drawcard.js';

class MotherOfDragons extends DrawCard {
    // Mother of Dragons (04094)
    // Stormborn character you control only.
    // Challenges Action: During a challenge in which you control a participating Dragon character,
    // kneel Mother of Dragons to have attached character participate in the challenge on your side.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Stormborn' });
        this.action({
            title: 'Add attached character to the challenge',
            condition: () =>
                this.parent.canParticipateInChallenge() &&
                this.controller.anyCardsInPlay(
                    (card) => card.isParticipating() && card.hasTrait('Dragon')
                ),
            cost: ability.costs.kneelSelf(),
            handler: () => {
                let challenge = this.game.currentChallenge;

                if (challenge.attackingPlayer === this.controller) {
                    challenge.addAttacker(this.parent);
                } else {
                    challenge.addDefender(this.parent);
                }
                this.game.addMessage(
                    '{0} kneels {1} to have {2} participate in the challenge on their side',
                    this.controller,
                    this,
                    this.parent
                );
            }
        });
    }
}

MotherOfDragons.code = '04094';

export default MotherOfDragons;
