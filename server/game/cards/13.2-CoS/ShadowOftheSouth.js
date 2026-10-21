import DrawCard from '../../drawcard.js';

class ShadowOfTheSouth extends DrawCard {
    // Shadow of the South (13036)
    // Shadow (1).
    // Action: Choose a character. Until the end of the phase, that character loses a challenge icon
    // of your choice. If there is a Scheme plot card revealed, return Shadow of the South to your
    // hand instead of placing it in your discard pile.
    setupCardAbilities() {
        this.action({
            title: 'Select a character',
            target: {
                activePromptTitle: 'Select a character',
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'character'
            },
            handler: (context) => {
                this.game.promptForIcon(this.controller, this, (icon) => {
                    this.untilEndOfPhase((ability) => ({
                        match: context.target,
                        effect: ability.effects.removeIcon(icon)
                    }));

                    this.game.addMessage(
                        '{0} uses {1} to remove {2} {3} icon from {4}',
                        this.controller,
                        this,
                        icon === 'intrigue' ? 'an' : 'a',
                        icon,
                        context.target
                    );
                });

                if (
                    this.game
                        .getPlayers()
                        .some((player) => player.activePlot && player.activePlot.hasTrait('Scheme'))
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

ShadowOfTheSouth.code = '13036';

export default ShadowOfTheSouth;
