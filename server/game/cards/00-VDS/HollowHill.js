import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class HollowHill extends DrawCard {
    // Hollow Hill (00018)
    // Reaction: After you marshal a character with a faction affiliation that does not match any
    // other card you control, draw 1 card.
    // Draft format only.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.playingType === 'marshal' &&
                    event.card.getType() === 'character' &&
                    event.card.controller === context.source.controller &&
                    context.source.doesNotMatchAnotherControlledFaction(event.card) &&
                    context.source.controller.canDraw()
            },
            message: '{player} uses {source} to draw 1 card',
            gameAction: GameActions.drawCards((context) => ({ player: context.player, amount: 1 }))
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
