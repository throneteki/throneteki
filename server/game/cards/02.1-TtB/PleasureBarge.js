import DrawCard from '../../drawcard.js';
import TextHelper from '../../TextHelper.js';

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
                onCardEntersPlay: (event) =>
                    event.card === this &&
                    event.playingType === 'marshal' &&
                    this.controller.canDraw() &&
                    !this.tracker.hasDrawnCardsThisPhase
            },
            handler: () => {
                let cards = this.controller.drawCardsToHand(3).length;
                this.game.addMessage(
                    '{0} plays {1} to draw {2}',
                    this.controller,
                    this,
                    TextHelper.count(cards, 'card')
                );
            }
        });
    }
}

class DrawTracker {
    constructor(game, player) {
        this.hasDrawnCardsThisPhase = false;
        game.on('onCardsDrawn', (event) => {
            if (event.player === player) {
                this.hasDrawnCardsThisPhase = true;
            }
        });
        game.on('onPhaseEnded', () => (this.hasDrawnCardsThisPhase = false));
    }
}

PleasureBarge.code = '02006';

export default PleasureBarge;
