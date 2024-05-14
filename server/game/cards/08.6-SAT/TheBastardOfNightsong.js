import DrawCard from '../../drawcard.js';

class TheBastardOfNightsong extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.challengeType === 'power' &&
                    this.isParticipating() &&
                    event.challenge.loser.faction.power > 0
            },
            handler: (context) => {
                let otherPlayer = context.event.challenge.loser;
                this.game.movePower(otherPlayer.faction, this.controller.faction, 1);

                this.game.addMessage(
                    "{0} uses {1} to move 1 power from {2}'s faction to their own",
                    this.controller,
                    this,
                    otherPlayer
                );
            }
        });
    }
}

TheBastardOfNightsong.code = '08107';

export default TheBastardOfNightsong;
