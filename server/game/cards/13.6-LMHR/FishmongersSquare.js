import DrawCard from '../../drawcard.js';

class FishmongersSquare extends DrawCard {
    // Fishmonger's Square (13112)
    // Marshaling Action: If there are 10 or more cards in an opponent's discard pile, kneel
    // Fishmonger's Square to draw 1 card and gain 1 gold.
    setupCardAbilities(ability) {
        this.action({
            title: 'Draw card and gain gold',
            phase: 'marshal',
            cost: ability.costs.kneelSelf(),
            condition: (context) =>
                this.opponentDiscardPileHas10() &&
                (context.player.canDraw() || context.player.canGainGold()),
            handler: (context) => {
                let messageSegments = [];
                if (context.player.canDraw()) {
                    context.player.drawCardsToHand(1);
                    messageSegments.push('draw 1 card');
                }
                if (context.player.canGainGold()) {
                    this.game.addGold(context.player, 1);
                    messageSegments.push('gain 1 gold');
                }
                const message = '{0} kneels {1} to ' + messageSegments.join(' and');
                this.game.addMessage(message, context.player, this);
            }
        });
    }

    opponentDiscardPileHas10() {
        let opponents = this.game.getOpponents(this.controller);
        return opponents.some((opponent) => opponent.discardPile.length >= 10);
    }
}

FishmongersSquare.code = '13112';

export default FishmongersSquare;
