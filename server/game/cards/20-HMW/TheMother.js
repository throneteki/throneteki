const PlotCard = require('../../plotcard');
const CardEntersPlayTracker = require('../../EventTrackers/CardEntersPlayTracker');

class TheMother extends PlotCard {
    setupCardAbilities(ability) {
        this.tracker = CardEntersPlayTracker.forRound(this.game);

        this.reaction({
            when: {
                onCardEntersPlay: event => (
                    event.card.controller !== this.controller &&
                    event.card.getType() === 'character' &&
                    this.getNumOfCharactersEnteringPlay(event.card.controller) > 1
                )
            },
            limit: ability.limit.perRound(2),
            handler: context => {
                context.player.drawCardsToHand(1);
                this.game.addMessage('{0} uses {1} to draw 1 card', context.player, this);
            }
        });
    }

    getNumOfCharactersEnteringPlay(opponent) {
        return this.tracker.events.reduce((count, event) => {
            if(event.card.controller === opponent && event.card.getType() === 'character') {
                return count + 1;
            }

            return count;
        }, 0);
    }
}

TheMother.code = '20057';

module.exports = TheMother;
