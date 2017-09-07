const _ = require('underscore');

const DrawCard = require('../../drawcard.js');

class HollowHill extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: event => event.playingType === 'marshal' && event.card.getType() === 'character' &&
                                           event.card.controller === this.controller && this.doesNotMatchAnotherControlledFaction(event.card)
            },
            handler: () => {
                this.controller.drawCardsToHand(1);
                this.game.addMessage('{0} uses {1} to draw 1 card', this.controller, this);
            }
        });
    }

    doesNotMatchAnotherControlledFaction(marshalledCard) {
        let marshalledFaction = marshalledCard.getPrintedFaction();

        if(marshalledFaction === 'neutral') {
            return false;
        }

        let factionsInPlay = [];

        this.controller.cardsInPlay.each(card => {
            if(card !== marshalledCard) {
                let factions = card.getFactions();
                _.each(factions, faction => {
                    if(!factionsInPlay.includes(faction) && faction !== 'neutral') {
                        factionsInPlay.push(faction);
                    }
                });
            }
        });

        return !factionsInPlay.includes(marshalledFaction);
    }
}

HollowHill.code = '00018';

module.exports = HollowHill;
