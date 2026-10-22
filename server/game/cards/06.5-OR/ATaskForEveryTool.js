import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ATaskForEveryTool extends DrawCard {
    // A Task For Every Tool (06090)
    // Challenges Action: Put a [lannister] character with printed STR 2 or lower into play from
    // your hand.
    setupCardAbilities() {
        this.action({
            title: 'Put character into play',
            phase: 'challenge',
            target: {
                cardCondition: (card, context) =>
                    card.location === 'hand' &&
                    card.controller === context.source.controller &&
                    card.getType() === 'character' &&
                    card.isFaction('lannister') &&
                    card.getPrintedStrength() <= 2 &&
                    context.source.controller.canPutIntoPlay(card)
            },
            message: '{player} plays {source} to put {target} into play from their hand',
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.target
            }))
        });
    }
}

ATaskForEveryTool.code = '06090';

export default ATaskForEveryTool;
