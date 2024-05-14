const DrawCard = require('../../drawcard');
const GenericTracker = require('../../EventTrackers/GenericTracker');
const CardEntersPlayTracker = require('../../EventTrackers/CardEntersPlayTracker');

class MaesterGormon extends DrawCard {
    setupCardAbilities(ability) {
        this.enterPlayTracker = CardEntersPlayTracker.forPhase(this.game);
        this.playedTracker = GenericTracker.forPhase(this.game, 'onCardPlayed');

        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.lookAtTopCard()
        });

        this.persistentEffect({
            condition: () => !this.hasPlayedFromDeck() && !this.hasMarshalledFromDeck(),
            targetController: 'current',
            effect: [
                ability.effects.canMarshal((card) => this.isTopCard(card)),
                ability.effects.canPlay((card) => this.isTopCard(card))
            ]
        });
    }

    isTopCard(card) {
        return (
            card.controller === this.controller &&
            card.location === 'draw deck' &&
            card === this.controller.drawDeck[0] &&
            !card.isFaction('tyrell')
        );
    }

    hasPlayedFromDeck() {
        return this.playedTracker.events.some(
            (event) =>
                event.originalLocation === 'draw deck' &&
                event.player === this.controller &&
                !event.card.isFaction('tyrell')
        );
    }

    hasMarshalledFromDeck() {
        return this.enterPlayTracker.events.some(
            (event) =>
                event.originalLocation === 'draw deck' &&
                event.card.controller === this.controller &&
                !event.card.isFaction('tyrell')
        );
    }
}

MaesterGormon.code = '13043';

module.exports = MaesterGormon;
