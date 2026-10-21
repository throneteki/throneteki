import DrawCard from '../../drawcard.js';
import TextHelper from '../../TextHelper.js';

class KingAtTheWall extends DrawCard {
    // King at the Wall (08108)
    // Unique [baratheon] character only.
    // Attached character gains the King trait.
    // Reaction: After you win a [power] challenge in which attached character is participating,
    // draw 1 card for each out-of-faction location you control.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'baratheon', unique: true });
        this.whileAttached({
            effect: ability.effects.addTrait('King')
        });

        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.challengeType === 'power' &&
                    event.challenge.isParticipating(this.parent) &&
                    this.numberOfOutOfFactionLocations() > 0 &&
                    this.controller.canDraw()
            },
            handler: () => {
                let cards = this.numberOfOutOfFactionLocations();
                cards = this.controller.drawCardsToHand(cards).length;

                this.game.addMessage(
                    '{0} uses {1} to draw {2}',
                    this.controller,
                    this,
                    TextHelper.count(cards, 'card')
                );
            }
        });
    }

    numberOfOutOfFactionLocations() {
        return this.controller.getNumberOfCardsInPlay(
            (card) => card.getType() === 'location' && card.isOutOfFaction()
        );
    }
}

KingAtTheWall.code = '08108';

export default KingAtTheWall;
