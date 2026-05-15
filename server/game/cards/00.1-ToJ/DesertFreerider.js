import DrawCard from '../../drawcard.js';

class DesertFreerider extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard 1 gold from ' + this.name,
            cost: ability.costs.discardGold(),
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
        this.untilEndOfPhase((ability) => ({
            match: context.target,
            effect: isGain
                ? ability.effects.addIcon('intrigue')
                : ability.effects.removeIcon('intrigue')
        }));

        this.game.addMessage(
            '{0} uses {1} to have {2} {3} an intrigue icon until the end of the phase',
            context.player,
            this,
            context.target,
            isGain ? 'gain' : 'lose'
        );
        return true;
    }
}

DesertFreerider.code = '00193';

export default DesertFreerider;
