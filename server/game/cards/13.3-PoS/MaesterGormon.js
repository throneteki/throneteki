import DrawCard from '../../drawcard.js';
import GenericTracker from '../../EventTrackers/GenericTracker.js';
import CardEntersPlayTracker from '../../EventTrackers/CardEntersPlayTracker.js';

class MaesterGormon extends DrawCard {
    // Maester Gormon (13043)
    // You may look at the top card of your deck.
    // Once per phase, if the top card of your deck is a non-[tyrell] card, you may marshal or play
    // it as if it were in your hand.
    setupCardAbilities(ability) {
        const enterPlayTracker = CardEntersPlayTracker.forPhase(this.game);
        const playedTracker = GenericTracker.forPhase(this.game, 'onCardPlayed');

        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.lookAtTopCard()
        });

        this.persistentEffect({
            condition: (context) =>
                !hasPlayedFromDeck(playedTracker, context.source.controller) &&
                !hasMarshalledFromDeck(enterPlayTracker, context.source.controller),
            targetController: 'current',
            effect: [
                ability.effects.canMarshal((card, context) =>
                    isTopCard(card, context.source.controller)
                ),
                ability.effects.canPlay((card, context) =>
                    isTopCard(card, context.source.controller)
                )
            ]
        });
    }
}

function isTopCard(card, player) {
    return (
        card.controller === player &&
        card.location === 'draw deck' &&
        card === player.drawDeck[0] &&
        !card.isFaction('tyrell')
    );
}

function hasPlayedFromDeck(playedTracker, player) {
    return playedTracker.events.some(
        (event) =>
            event.originalLocation === 'draw deck' &&
            event.player === player &&
            !event.card.isFaction('tyrell')
    );
}

function hasMarshalledFromDeck(enterPlayTracker, player) {
    return enterPlayTracker.events.some(
        (event) =>
            event.originalLocation === 'draw deck' &&
            event.card.controller === player &&
            !event.card.isFaction('tyrell')
    );
}

MaesterGormon.code = '13043';

export default MaesterGormon;
