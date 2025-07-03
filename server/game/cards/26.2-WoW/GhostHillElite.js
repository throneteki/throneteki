import ChallengeTypes from '../../ChallengeTypes.js';
import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class GhostHillElite extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this
            },
            target: {
                cardCondition: {
                    location: 'play area',
                    type: 'character'
                }
            },
            message:
                '{player} uses {source} to have {target} lose a challenge icon of their choice and gain that icon until the end of the phase',
            handler: (context) => {
                this.target = context.target;
                this.game.promptWithMenu(context.player, this, {
                    activePrompt: {
                        menuTitle: 'Select an icon',
                        buttons: ChallengeTypes.asButtons({ method: 'selectIcon' }).filter(
                            (button) => ['intrigue', 'power'].includes(button.arg)
                        )
                    },
                    source: this
                });
            }
        });
    }

    selectIcon(player, icon) {
        this.untilEndOfPhase((ability) => ({
            match: this.target,
            effect: ability.effects.removeIcon(icon)
        }));
        this.untilEndOfPhase((ability) => ({
            match: this,
            effect: ability.effects.addIcon(icon)
        }));

        this.game.addMessage(
            '{0} chooses to have {1} lose {2} {3} icon and have {4} gain {2} {3} icon until the end of the phase',
            player,
            this.target,
            icon === 'intrigue' ? 'an' : 'a',
            icon,
            this
        );

        this.game.queueSimpleStep(() => {
            if (this.target.getNumberOfIcons() === 0) {
                this.game.resolveGameAction(GameActions.kill({ card: this.target }));
                this.game.addMessage('Then, {0} uses {1} to kill {2}', player, this, this.target);
            }
        });
        return true;
    }
}

GhostHillElite.code = '26027';

export default GhostHillElite;
