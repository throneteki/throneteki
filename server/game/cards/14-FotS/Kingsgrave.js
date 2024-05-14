import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Kingsgrave extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.isMatch({
                        loser: this.controller,
                        challengeType: 'power',
                        by5: true
                    })
            },
            cost: [ability.costs.kneelSelf(), ability.costs.sacrificeSelf()],
            target: {
                cardCondition: (card) => card.getType() === 'character' && card.isParticipating(),
                gameAction: 'returnToHand'
            },
            handler: (context) => {
                this.context = context;

                if (context.target.hasTrait('King') && context.target.canBeKilled()) {
                    this.game.promptWithMenu(context.player, this, {
                        activePrompt: {
                            menuTitle: `Kill ${context.target.name}?`,
                            buttons: [
                                { text: 'Yes', method: 'killCharacter' },
                                { text: 'No', method: 'returnCharacterToHand' }
                            ]
                        },
                        source: this
                    });
                } else {
                    this.returnCharacterToHand();
                }
            }
        });
    }

    killCharacter() {
        this.game.addMessage(
            '{0} kneels and sacrifices {1} to kill {2}',
            this.context.player,
            this,
            this.context.target
        );
        this.game.killCharacter(this.context.target);
        return true;
    }

    returnCharacterToHand() {
        this.game.addMessage(
            '{0} kneels and sacrifices {1} to return {2} to hand',
            this.context.player,
            this,
            this.context.target
        );
        this.game.resolveGameAction(
            GameActions.returnCardToHand((context) => ({ card: context.target })),
            this.context
        );

        return true;
    }
}

Kingsgrave.code = '14030';

export default Kingsgrave;
