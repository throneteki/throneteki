const DrawCard = require('../../drawcard.js');
const ChallengeTypes = require('../../ChallengeTypes');

class DesertRaider extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) => event.challenge.loser === this.controller
            },
            location: 'dead pile',
            cost: ability.costs.putSelfIntoPlay(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    this.game.currentChallenge.winner === card.controller
            },
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
            '{0} puts {1} into play from their dead pile to have {2} lose {3} {4} icon and have {1} gain {3} {4} icon until the end of the phase',
            this.controller,
            this,
            this.target,
            icon === 'intrigue' ? 'an' : 'a',
            icon
        );

        return true;
    }
}

DesertRaider.code = '17112';

module.exports = DesertRaider;
