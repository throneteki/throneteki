const OpenInformationLocations = [
    'active plot',
    'agenda',
    'being played',
    'dead pile',
    'discard pile',
    'duplicate',
    'faction',
    'out of game',
    'play area',
    'revealed plots',
    'title'
];

class CardVisibility {
    constructor(game) {
        this.game = game;
        this.rules = [
            (card) => this.isPublicRule(card),
            (card, player) => this.isControllerRule(card, player),
            (card, player) => this.isSpectatorRule(card, player)
        ];
    }

    isVisible(card, player) {
        return this.rules.some((rule) => rule(card, player));
    }

    addRule(rule) {
        this.rules.push(rule);
    }

    removeRule(rule) {
        this.rules = this.rules.filter((r) => r !== rule);
    }

    isPublicRule(card) {
        return OpenInformationLocations.includes(card.location) && !card.facedown;
    }

    isControllerRule(card, player) {
        return card.controller === player && (card.location !== 'draw deck' || player.showDeck);
    }

    isSpectatorRule(card, player) {
        return (
            this.game.showHand &&
            player.isSpectator() &&
            ['hand', 'shadows'].includes(card.location)
        );
    }
}

module.exports = CardVisibility;
