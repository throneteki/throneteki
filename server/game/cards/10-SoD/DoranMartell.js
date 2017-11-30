const DrawCard = require('../../drawcard.js');

class DoranMartell extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Remove character from challenge',
            cost: ability.costs.kneelFactionCard(),
            target: {
                cardCondition: card => card.location === 'play area' && this.game.currentChallenge.isParticipating(card) &&
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
                this.game.promptForIcon(context.player, this, icon => {
                    if(context.target.controller !== context.player) {
                        this.untilEndOfPhase(ability => ({
                            match: context.target,
                            effect: ability.effects.removeIcon(icon)
                        }));

                        this.game.addMessage('{0} uses {1} to remove {2} {3} icon from {4} until the end of the phase',
                            context.player, this, icon === 'intrigue' ? 'an' : 'a', icon, context.target);
                    } else {
                        this.untilEndOfPhase(ability => ({
                            match: context.target,
                            effect: ability.effects.addIcon(icon)
                        }));

                        this.game.addMessage('{0} uses {1} to give {2} {3} icon to {4} until the end of the phase',
                            context.player, this, icon === 'intrigue' ? 'an' : 'a', icon, context.target);
                    }
                });
            }
        });
    }
}

DoranMartell.code = '10001';

module.exports = DoranMartell;
