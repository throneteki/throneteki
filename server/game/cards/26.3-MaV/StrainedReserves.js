import CardEntersPlayTracker from '../../EventTrackers/CardEntersPlayTracker.js';
import PlotCard from '../../plotcard.js';

class StrainedReserves extends PlotCard {
    // Strained Reserves (26060)
    // Each player cannot marshal or put into play more than 2 characters, locations, or attachments
    // this round. (4 characters, locations, or attachments instead if that player has a Summer plot
    // card revealed.)
    setupCardAbilities(ability) {
        const tracker = CardEntersPlayTracker.forRound(this.game);
        const isRestricted = (card) =>
            isLimitedType(card) && hasReachedLimit(tracker, card.controller);

        this.persistentEffect({
            targetController: 'any',
            effect: [
                ability.effects.cannotMarshal(isRestricted),
                ability.effects.cannotPutIntoPlay(isRestricted)
            ]
        });
    }
}

function isLimitedType(card) {
    return ['character', 'location', 'attachment'].includes(card.getType());
}

function hasReachedLimit(tracker, player) {
    const entered = tracker.events.filter(
        (event) =>
            event.card.controller === player &&
            isLimitedType(event.card) &&
            ['marshal', 'ambush', 'outOfShadows', 'play'].includes(event.playingType)
    );
    return entered.length >= getLimit(player);
}

function getLimit(player) {
    return player.activePlot && player.activePlot.hasTrait('Summer') ? 4 : 2;
}

StrainedReserves.code = '26060';

export default StrainedReserves;
