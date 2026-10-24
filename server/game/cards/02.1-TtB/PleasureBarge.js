import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import GenericTracker from '../../EventTrackers/GenericTracker.js';

class PleasureBarge extends DrawCard {
    // Pleasure Barge (02006)
    // Immune to card effects.
    // Reaction: After you marshal Pleasure Barge, if you have not yet drawn any cards this phase,
    // draw 3 cards.
    // -1 Income.
    setupCardAbilities(ability) {
        this.drawTracker = GenericTracker.forPhase(this.game, 'onCardsDrawn');
        this.plotModifiers({
            gold: -1
        });
        this.persistentEffect({
            match: (card, context) => card === context.source,
            effect: ability.effects.immuneTo(() => true)
        });
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card === context.source &&
                    event.playingType === 'marshal' &&
                    context.player.canDraw() &&
                    !context.source.drawTracker.events.some(
                        (drawEvent) => drawEvent.player === context.player
                    )
            },
            message: '{player} plays {source} to draw 3 cards',
            gameAction: GameActions.drawCards((context) => ({ player: context.player, amount: 3 }))
        });
    }
}

PleasureBarge.code = '02006';

export default PleasureBarge;
