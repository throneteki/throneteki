import PlotCard from '../../plotcard.js';
import CardEntersPlayTracker from '../../EventTrackers/CardEntersPlayTracker.js';
import GameActions from '../../GameActions/index.js';

class TheMother extends PlotCard {
    // The Mother (20057)
    // Reaction: After a character enters play under an opponent's control, if another character
    // entered play under that player's control this round, draw 1 card. (Limit twice per round.)
    setupCardAbilities(ability) {
        this.tracker = CardEntersPlayTracker.forRound(this.game);

        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card.controller !== context.source.controller &&
                    event.card.getType() === 'character' &&
                    context.source.getNumOfCharactersEnteringPlay(event.card.controller) > 1
            },
            limit: ability.limit.perRound(2),
            message: '{player} uses {source} to draw 1 card',
            gameAction: GameActions.drawCards((context) => ({ player: context.player, amount: 1 }))
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
