const DrawCard = require('../../drawcard.js');

class DoranMartell extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Remove character from challenge',
            cost: ability.costs.kneelFactionCard(),
            target: {
                cardCondition: card => card.location === 'play area' && card.isParticipating() &&
                                       card.getNumberOfIcons() < 2
            },
            handler: context => {
                this.game.currentChallenge.removeFromChallenge(context.target);
                this.game.addMessage('{0} uses {1} and kneels their faction card to remove {2} from the challenge',
                    context.player, this, context.target);
            }
        });
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.loser === this.controller
            },
            target: {
                cardCondition: card => card.location === 'play area' && card.getType() === 'character'
            },
            handler: context => {
                this.game.promptWithMenu(context.player, this.createPromptContext(context), {
                    activePrompt: {
                        menuTitle: 'Give or remove icon from ' + context.target.name + '?',
                        buttons: [
                            { text: 'Give', method: 'giveIcon' },
                            { text: 'Remove', method: 'removeIcon' }
                        ]
                    },
                    source: this
                });
            }
        });
    }

    createPromptContext(context) {
        return {
            giveIcon: () => this.handleIcon(context, true),
            removeIcon: () => this.handleIcon(context, false)
        };
    }

    handleIcon(context, isGive) {
        this.game.promptForIcon(context.player, this, icon => {
            this.untilEndOfPhase(ability => ({
                match: context.target,
                effect: isGive ? ability.effects.addIcon(icon) : ability.effects.removeIcon(icon)
            }));

            this.game.addMessage('{0} uses {1} to {2} {3} {4} icon {5} {6} until the end of the phase',
                context.player, this, isGive ? 'give' : 'remove', icon === 'intrigue' ? 'an' : 'a', icon,
                isGive ? 'to' : 'from', context.target);
        });
        return true;
    }
}

DoranMartell.code = '10001';

module.exports = DoranMartell;
