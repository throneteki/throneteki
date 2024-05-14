import DrawCard from '../../drawcard.js';

class HollowHill extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) =>
                    event.playingType === 'marshal' &&
                    event.card.getType() === 'character' &&
                    event.card.controller === this.controller &&
                    this.doesNotMatchAnotherControlledFaction(event.card) &&
                    this.controller.canDraw()
            },
            handler: () => {
                this.controller.drawCardsToHand(1);
                this.game.addMessage('{0} uses {1} to draw 1 card', this.controller, this);
            }
        });
    }

    doesNotMatchAnotherControlledFaction(marshalledCard) {
        let marshalledFaction = marshalledCard.getPrintedFaction();

        if (marshalledFaction === 'neutral') {
            return false;
        }

        let factionsInPlay = [];

        for (const card of this.controller.cardsInPlay) {
            if (card !== marshalledCard) {
                let factions = card.getFactions();
                for (const faction of factions) {
                    if (!factionsInPlay.includes(faction) && faction !== 'neutral') {
                        factionsInPlay.push(faction);
                    }
                }
            }
        }

        return !factionsInPlay.includes(marshalledFaction);
    }
}

HollowHill.code = '00018';

export default HollowHill;
