import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ArianneMartell extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Remove and gain icon',
            max: ability.limit.perRound(1),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'character'
            },
            handler: (context) => {
                this.game.promptForIcon(this.controller, this, (icon) => {
                    this.untilEndOfPhase((ability) => ({
                        match: context.target,
                        effect: ability.effects.removeIcon(icon)
                    }));

                    let nonMartellChars = this.controller.filterCardsInPlay(
                        (card) => card.getType() === 'character' && !card.isFaction('martell')
                    );
                    this.untilEndOfPhase((ability) => ({
                        match: nonMartellChars,
                        effect: ability.effects.addIcon(icon)
                    }));

                    this.game.addMessage(
                        '{0} uses {1} to remove {2} {3} icon from {4} and have each non-martell character they control gain it',
                        this.controller,
                        this,
                        icon === 'intrigue' ? 'an' : 'a',
                        icon,
                        context.target
                    );

                    this.game.resolveGameAction(
                        GameActions.returnCardToHand(() => ({
                            card: this,
                            allowSave: false
                        })),
                        context
                    );
                    this.game.addMessage('{0} then returns {1} to hand', this.controller, this);
                });
            }
        });
    }
}

ArianneMartell.code = '00177';

export default ArianneMartell;
