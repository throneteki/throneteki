import PlotCard from '../../plotcard.js';
import CardEntersPlayTracker from '../../EventTrackers/CardEntersPlayTracker.js';

class TheMother extends PlotCard {
    setupCardAbilities(ability) {
        this.tracker = CardEntersPlayTracker.forRound(this.game);

        this.reaction({
            when: {
                onCardEntersPlay: (event) =>
                    event.card.controller !== this.controller &&
                    event.card.getType() === 'character' &&
                    this.getNumOfCharactersEnteringPlay(event.card.controller) > 1
            },
            limit: ability.limit.perRound(2),
            message: '{player} uses {source} to draw 1 card',
            handler: (context) => {
                context.player.drawCardsToHand(1);
            }
        });
    }

    getNumOfCharactersEnteringPlay(opponent) {
        return this.tracker.events.reduce((count, event) => {
            if (event.card.controller === opponent && event.card.getType() === 'character') {
                return count + 1;
            }

            return count;
        }, 0);
    }
}

TheMother.code = '20057';

export default TheMother;
