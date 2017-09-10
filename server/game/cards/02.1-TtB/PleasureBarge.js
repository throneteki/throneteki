const DrawCard = require('../../drawcard.js');

class PleasureBarge extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);
        this.tracker = new DrawTracker(this.game, this.controller);
    }

    setupCardAbilities(ability) {
        this.plotModifiers({
            gold: -1
        });
        this.persistentEffect({
            match: this,
            effect: ability.effects.immuneTo(() => true)
        });
        this.reaction({
            when: {
                onCardEntersPlay: event => event.card === this && event.playingType === 'marshal' &&
                                           !this.tracker.hasDrawnCardsThisPhase
            },
            handler: () => {
                this.controller.drawCardsToHand(3);
                this.game.addMessage('{0} uses {1} to draw 3 cards', this.controller, this);
            }
        });
    }
}

class DrawTracker {
    constructor(game, player) {
        this.hasDrawnCardsThisPhase = false;
        game.on('onCardsDrawn', event => {
            if(event.player === player) {
                this.hasDrawnCardsThisPhase = true;
            }
        });
        game.on('onPhaseEnded', () => this.hasDrawnCardsThisPhase = false);
    }
}

PleasureBarge.code = '02006';

module.exports = PleasureBarge;
