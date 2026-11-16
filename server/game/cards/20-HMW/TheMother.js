import PlotCard from '../../plotcard.js';
import CardEntersPlayTracker from '../../EventTrackers/CardEntersPlayTracker.js';
import GameActions from '../../GameActions/index.js';

class TheMother extends PlotCard {
    // The Mother (20057)
    // Reaction: After a character enters play under an opponent's control, if another character
    // entered play under that player's control this round, draw 1 card. (Limit twice per round.)
    setupCardAbilities(ability) {
        const tracker = CardEntersPlayTracker.forRound(this.game);

        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card.controller !== context.source.controller &&
                    event.card.getType() === 'character' &&
                    charactersEnteredPlayUnder(tracker, event.card.controller) > 1
            },
            limit: ability.limit.perRound(2),
            message: '{player} uses {source} to draw 1 card',
            gameAction: GameActions.drawCards((context) => ({ player: context.player, amount: 1 }))
        });
    }
}

function charactersEnteredPlayUnder(tracker, player) {
    return tracker.events.filter(
        (event) =>
            tracker.controllerOnEntry(event) === player && event.card.getType() === 'character'
    ).length;
}

TheMother.code = '20057';

export default TheMother;
