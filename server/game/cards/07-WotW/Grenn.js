import DrawCard from '../../drawcard.js';

class Grenn extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    this.isAttacking() &&
                    event.challenge.loser.faction.power > 0
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card !== this &&
                    card.isAttacking() &&
                    card.isFaction('thenightswatch') &&
                    card.getType() === 'character'
            },
            handler: (context) => {
                let otherPlayer = context.event.challenge.loser;
                let power =
                    otherPlayer.faction.power > 1 && context.target.kneeled === false ? 2 : 1;
                this.game.movePower(otherPlayer.faction, context.target, power);

                this.game.addMessage(
                    "{0} uses {1} to move {2} power from {3}'s faction to {4}",
                    this.controller,
                    this,
                    power,
                    otherPlayer,
                    context.target
                );
            }
        });
    }
}

Grenn.code = '07010';

export default Grenn;
