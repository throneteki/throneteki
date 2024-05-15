import DrawCard from '../../drawcard.js';
import TextHelper from '../../TextHelper.js';

class NoGodlessMan extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    this.hasParticipatingDrownedGod(this.controller) &&
                    event.challenge.challengeType === 'power' &&
                    event.challenge.strengthDifference >= 5 &&
                    (this.controller.canDraw() || event.challenge.loser.hand.length > 0)
            },
            max: ability.limit.perChallenge(1),
            handler: (context) => {
                let number = Math.trunc(this.game.currentChallenge.strengthDifference / 5);
                this.game.addMessage(
                    "{0} uses {1} to draw {2} and discard {2} from {3}'s hand",
                    context.player,
                    this,
                    TextHelper.count(number, 'card'),
                    context.event.challenge.loser
                );

                context.event.challenge.loser.discardAtRandom(number);

                context.player.drawCardsToHand(number);
            }
        });
    }

    hasParticipatingDrownedGod(player) {
        return player.anyCardsInPlay(
            (card) =>
                card.isParticipating() &&
                card.hasTrait('Drowned God') &&
                card.getType() === 'character'
        );
    }
}

NoGodlessMan.code = '20010';

export default NoGodlessMan;
