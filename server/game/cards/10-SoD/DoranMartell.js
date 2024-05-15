import DrawCard from '../../drawcard.js';

class DoranMartell extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Remove character from challenge',
            cost: ability.costs.kneelFactionCard(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.isParticipating() &&
                    card.getNumberOfIcons() < 2
            },
            handler: (context) => {
                this.game.currentChallenge.removeFromChallenge(context.target);
                this.game.addMessage(
                    '{0} uses {1} and kneels their faction card to remove {2} from the challenge',
                    context.player,
                    this,
                    context.target
                );
            }
        });
        this.reaction({
            when: {
                afterChallenge: (event) => event.challenge.loser === this.controller
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'character'
            },
            handler: (context) => {
                this.game.promptWithMenu(context.player, this.createPromptContext(context), {
                    activePrompt: {
                        menuTitle: 'Choose for ' + context.target.name + '?',
                        buttons: [
                            { text: 'Gain Icon', method: 'gainIcon' },
                            { text: 'Lose Icon', method: 'loseIcon' }
                        ]
                    },
                    source: this
                });
            }
        });
    }

    createPromptContext(context) {
        return {
            gainIcon: () => this.handleIcon(context, true),
            loseIcon: () => this.handleIcon(context, false)
        };
    }

    handleIcon(context, isGain) {
        this.game.promptForIcon(context.player, this, (icon) => {
            this.untilEndOfPhase((ability) => ({
                match: context.target,
                effect: isGain ? ability.effects.addIcon(icon) : ability.effects.removeIcon(icon)
            }));

            this.game.addMessage(
                '{0} uses {1} to have {2} {3} {4} {5} icon until the end of the phase',
                context.player,
                this,
                context.target,
                isGain ? 'gain' : 'lose',
                icon === 'intrigue' ? 'an' : 'a',
                icon
            );
        });
        return true;
    }
}

DoranMartell.code = '10001';

export default DoranMartell;
