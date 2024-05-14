import DrawCard from '../../drawcard.js';

class BlackcrownKnights extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.challengeType === 'power' &&
                    this.isParticipating() &&
                    this.allowGameAction('gainPower')
            },
            cost: ability.costs.discardFromHand(),
            handler: (context) => {
                this.modifyPower(2);
                this.game.addMessage(
                    '{0} uses {1} and discards {2} from their hand to gain 2 power on {1}',
                    this.controller,
                    this,
                    context.costs.discardFromHand
                );
            }
        });
    }
}

BlackcrownKnights.code = '00016';

export default BlackcrownKnights;
