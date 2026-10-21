import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';

class Yunkai extends DrawCard {
    // Yunkai (08074)
    // Bestow (4).
    // Action: During a challenge in which you are the attacking player, kneel Yunkai and discard X
    // gold from it to remove each character with STR X or lower from the challenge (X cannot be 0).
    // Then, if you win the challenge, place 2 gold from the treasury on Yunkai.
    setupCardAbilities(ability) {
        this.action({
            title: 'Remove characters from challenge',
            condition: () =>
                this.game.currentChallenge &&
                this.game.currentChallenge.attackingPlayer === this.controller &&
                this.game.currentChallenge.getNumberOfParticipants() > 0,
            cost: [
                ability.costs.kneelSelf(),
                ability.costs.discardXGold(
                    () => this.getLowestParticipatingStr(),
                    () => this.getHighestParticipatingStr()
                )
            ],
            handler: (context) => {
                let participantsToRemove = this.game.filterCardsInPlay(
                    (card) => card.isParticipating() && card.getStrength() <= context.xValue
                );

                for (let card of participantsToRemove) {
                    this.game.currentChallenge.removeFromChallenge(card);
                }

                this.game.addMessage(
                    '{0} kneels and discards {1} gold from {2} to remove all characters with STR {1} or lower from the challenge',
                    context.player,
                    context.xValue,
                    this
                );

                this.game.once('afterChallenge', (event) => this.onChallengeWon(event.challenge));
            }
        });
    }

    onChallengeWon(challenge) {
        if (challenge.winner !== this.controller || this.location !== 'play area') {
            return;
        }

        this.modifyToken(Tokens.gold, 2);
        this.game.addMessage(
            '{0} places 2 gold tokens from the treasury on {1}',
            this.controller,
            this
        );
    }

    getLowestParticipatingStr() {
        let strengths = this.getParticipatingStrengths();
        let lowestStrength = Math.min(...strengths);
        return Math.max(lowestStrength, 1);
    }

    getHighestParticipatingStr() {
        let strengths = this.getParticipatingStrengths();
        let highestStrength = Math.max(...strengths);
        return Math.max(highestStrength, 1);
    }

    getParticipatingStrengths() {
        let participatingCharacters = this.game.filterCardsInPlay((card) => card.isParticipating());
        return participatingCharacters.map((card) => card.getStrength());
    }
}

Yunkai.code = '08074';

export default Yunkai;
