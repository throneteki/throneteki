import DrawCard from '../../drawcard.js';

class ATaskForEveryTool extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Put character into play',
            phase: 'challenge',
            target: {
                cardCondition: (card) =>
                    card.location === 'hand' &&
                    card.controller === this.controller &&
                    card.getType() === 'character' &&
                    card.isFaction('lannister') &&
                    card.getPrintedStrength() <= 2 &&
                    this.controller.canPutIntoPlay(card)
            },
            handler: (context) => {
                context.player.putIntoPlay(context.target);
                this.game.addMessage(
                    '{0} plays {1} to put {2} into play from their hand',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

ATaskForEveryTool.code = '06090';

export default ATaskForEveryTool;
