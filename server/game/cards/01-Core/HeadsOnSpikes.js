import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class HeadsOnSpikes extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            chooseOpponent: true,
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.discardAtRandom((context) => ({
                        amount: 1,
                        player: context.opponent,
                        discardEvent: (card) => {
                            const event = GameActions.discardCard({
                                card,
                                allowSave: false
                            }).createEvent();
                            let powerMessage = '';

                            if (card.getType() === 'character') {
                                event.replaceChildEvent(
                                    'onCardPlaced',
                                    GameActions.placeCard({
                                        card: event.card,
                                        location: 'dead pile'
                                    }).createEvent()
                                );
                                const gainPower = GameActions.gainPower({
                                    amount: 2,
                                    card: context.player.faction
                                });
                                if (gainPower.allow()) {
                                    powerMessage = ' and gain 2 power for their faction';
                                    event.addChildEvent(gainPower.createEvent());
                                }
                            }

                            this.game.addMessage(
                                "{0} uses {1} to discard {2} from {3}'s hand{4}",
                                context.player,
                                context.source,
                                card,
                                context.opponent,
                                powerMessage
                            );

                            return event;
                        }
                    })),
                    context
                );
            }
        });
    }
}

HeadsOnSpikes.code = '01013';

export default HeadsOnSpikes;
