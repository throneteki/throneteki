import DrawCard from '../../drawcard.js';

class ThePrincesPlan extends DrawCard {
    // The Prince's Plan (06016)
    // Action: Choose a character. Until the end of the phase, that character gets +1 STR for each
    // plot card in your used pile and gains a challenge icon of your choice.
    // Reaction: After you lose a challenge, pay 1 gold to return The Prince's Plan from your
    // discard pile to your hand.
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

export default ThePrincesPlan;
