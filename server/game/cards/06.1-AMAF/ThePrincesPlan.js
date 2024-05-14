const DrawCard = require('../../drawcard.js');

class ThePrincesPlan extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give +1 STR per used plot + icon',
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'character'
            },
            handler: (context) => {
                let strBoost = this.controller.getNumberOfUsedPlots();
                this.game.promptForIcon(this.controller, this, (icon) => {
                    this.game.addMessage(
                        '{0} plays {1} to give {2} +{3} STR and {4} {5} icon until the end of the phase',
                        this.controller,
                        this,
                        context.target,
                        strBoost,
                        icon === 'intrigue' ? 'an' : 'a',
                        icon
                    );
                    this.untilEndOfPhase((ability) => ({
                        match: context.target,
                        effect: [
                            ability.effects.modifyStrength(strBoost),
                            ability.effects.addIcon(icon)
                        ]
                    }));
                });
            }
        });

        this.reaction({
            location: 'discard pile',
            when: {
                afterChallenge: (event) => event.challenge.loser === this.controller
            },
            ignoreEventCosts: true,
            cost: ability.costs.payGold(1),
            handler: () => {
                this.game.addMessage(
                    '{0} pays 1 gold to move {1} back to their hand',
                    this.controller,
                    this
                );
                this.controller.moveCard(this, 'hand');
            }
        });
    }
}

ThePrincesPlan.code = '06016';

module.exports = ThePrincesPlan;
