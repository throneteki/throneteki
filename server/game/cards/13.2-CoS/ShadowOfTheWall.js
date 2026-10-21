import DrawCard from '../../drawcard.js';

class ShadowOfTheWall extends DrawCard {
    // Shadow of the Wall (13026)
    // Shadow (0).
    // Action: Choose and stand a character with 1 or fewer challenge icons. If there is a Winter
    // plot card revealed, return Shadow of the Wall to your hand instead of placing it in your
    // discard pile.
    setupCardAbilities() {
        this.action({
            title: 'Stand a character with 1 or fewer challange icons',
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.getNumberOfIcons() <= 1,
                gameAction: 'stand'
            },
            handler: (context) => {
                this.controller.standCard(context.target);
                this.game.addMessage(
                    '{0} plays {1} to stand {2}',
                    this.controller,
                    this,
                    context.target
                );
                if (
                    this.game
                        .getPlayers()
                        .some((player) => player.activePlot && player.activePlot.hasTrait('Winter'))
                ) {
                    this.game.addMessage(
                        '{0} uses {1} to return {1} to their hand instead of their discard pile',
                        this.controller,
                        this
                    );
                    this.controller.moveCard(this, 'hand');
                }
            }
        });
    }
}

ShadowOfTheWall.code = '13026';

export default ShadowOfTheWall;
